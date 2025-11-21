/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import AsyncChecker from '@common/misc/async-checker';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import MeshFromTris from '@core/misc/mesh-from-tris';
import GeoTris      from '@core/misc/geometry-tris';
import Processing   from './v-processing';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 四边面重建
 */
export default class QuadRemesh extends Base {
    /**
     * 设置面板
     */
    #setter;

    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * mesh的三角形数据
     */
    #mesh_tris;

    /**
     * 编辑的Soup
     */
    #soup;

    /**
     * 进度条
     */
    #processing = new Processing();

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} coordinator 
     * @param {*} mesh 
     */
    constructor(host, coordinator, mesh) {
        if (!(mesh instanceof EditableMesh)) {
            throw new Error("Mesh must be instance of EditableMesh");
        }
        super(host, coordinator, mesh);

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidTris,
            GeoSolidTrisQuad,
        } = Chameleon;

        // 初始化
        this.#mesh      = mesh;
        this.#soup      = mesh.getEditableSoup().clone();
        this.#mesh_tris = GeoSolidTris.MakeFromSoup(this.#soup.getPtr());
        
        this.updateWireframe(this.#soup);
        this.renderNextFrame();
    }

    /**
     * 启动
     */
    start() {
        super.start();

        // 保存历史记录
        this.historical_recorder.saveMeshSoup(this.#mesh);

        // 设置窗口
        this.#setter = new Setter(this, () => this.#onClickCommit());
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.quadremesh');
    }

    /**
     * 点击了
     */
    #onClickCommit() {
        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidTrisQuad     ,
            GeoSolidTrisQuadAsync,      // 有内存问题，莫名其妙
        } = Chameleon;

        // 显示加载
        this.setting_panel_container.appendOverlayContent(this.#processing);

        // 获取参数
        const target_faces   = this.#setter.faces_count;
        const sharp          = this.#setter.sharp;
        const boundary       = this.#setter.boundary;
        const adaptive_scale = this.#setter.adaptive_scale;

        // 下一帧执行
        requestAnimationFrame(() => requestAnimationFrame(() => {
            // 转化
            const convert = GeoSolidTrisQuad.MakeShared(this.#mesh_tris);
            convert.convert(target_faces, sharp, boundary, adaptive_scale, false);
            
            // 获取soup
            const soup = convert.getSoup();
            if (soup) {
                MeshFromSoup(this.#mesh, soup);
                this.updateWireframe(soup);
                soup.delete();
            }

            // 销毁
            if (convert) {
                convert.delete();
            }
                
            this.#processing.remove();
            this.renderNextFrame();
            this.commit();
        }));
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁
        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        // 销毁
        if (this.#mesh_tris) {
            this.#mesh_tris.delete();
            this.#mesh_tris = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}

