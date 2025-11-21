/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import AsyncChecker from '@common/misc/async-checker';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Processing   from './v-processing';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 体素重建
 */
export default class VoxelRemesh extends Base {
    /**
     * 设置面板
     */
    #setter;

    /**
     * 操作的mesh
     */
    #mesh;
    #mesh_boundbox = new XThree.Box3();

    /**
     * 编辑的Soup
     */
    #soup;

    /**
     * 进度条
     */
    #processing = new Processing();

    /**
     * 获取
     */
    get BBoxX() {
        return this.#mesh_boundbox.max.x - this.#mesh_boundbox.min.x;
    }

    /**
     * 获取
     */
    get BBoxY() {
        return this.#mesh_boundbox.max.y - this.#mesh_boundbox.min.y;
    }

    /**
     * 获取
     */
    get BBoxZ() {
        return this.#mesh_boundbox.max.z - this.#mesh_boundbox.min.z;
    }

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

        // 初始化
        this.#mesh = mesh;
        this.#soup = mesh.getEditableSoup().clone();
        this.#mesh_boundbox.setFromObject(mesh);
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

        // 计算
        const x = this.BBoxX.toFixed(2);
        const y = this.BBoxY.toFixed(2);
        const z = this.BBoxZ.toFixed(2);

        // 设置窗口
        this.#setter = new Setter(this, 
            () => this.#onClickRebuild(), 
            () => this.commit());
        this.#setter.setBoundbox(x, y, z);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.quadremesh');
    }

    /**
     * 点击了
     */
    #onClickRebuild() {
        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupRemesherSparseVoxels,
        } = Chameleon;

        // 显示加载
        this.setting_panel_container.appendOverlayContent(this.#processing);

        // 获取参数
        const segments = this.#setter.segments_count;
        const band     = this.#setter.band;

        // 计算体素尺寸
        const s0 = this.BBoxX / segments;
        const s1 = this.BBoxY / segments;
        const s2 = this.BBoxZ / segments;

        // 下一帧执行
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const soup = GeoSolidSoupRemesherSparseVoxels.remesh(
                this.#soup.getPtr(),
                (s0 + s1 + s2) / 3.0, 
                band, 
                0);

            if (soup) {
                MeshFromSoup(this.#mesh, soup);
                this.updateWireframe(this.#soup);
                soup.delete();
            }

            this.#processing.remove();
            this.renderNextFrame();
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

        // 下一帧渲染
        this.renderNextFrame();
    }
}

