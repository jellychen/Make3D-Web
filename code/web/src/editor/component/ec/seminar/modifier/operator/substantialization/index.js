/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 实体化
 */
export default class Substantialization extends Base {
    /**
     * 设置面板
     */
    #setter;

    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * 编辑的Soup
     */
    #soup;

    /**
     * wasm
     */
    #connector;

    /**
     * 记录值
     */
    #offset_f = 0;
    #offset_b = 0;

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
        this.#mesh = mesh;
        this.#soup = mesh.getEditableSoup().clone();
        
        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirSoupSubstantializeController,
        } = Chameleon;

        // 转化到 SurfaceMesh
        this.#connector = new AbattoirSoupSubstantializeController();
        this.#connector.setup(this.#soup);
        this.updateWireframe(this.#soup);
        this.renderNextFrame();
    }

    /**
     * 启动
     */
    start() {
        super.start();

        // 检测是不是支持实体化操作
        if (!this.#connector.check()) {
            GlobalScope.alertBox({
                icon               : 'warn',
                text_content_token : 'modifier.substantialization.nosupport',
                callback           : () => {
                    this.commit();
                }
            });
        } else {
            this.#setter = new Setter(
                this, 
                () => this.#onSetterChanged(),
                () => this.#onCommit());
            this.#setter.setFront(0);
            this.#setter.setBack (0);
            this.setting_panel_container.setContent(this.#setter);
            this.setting_panel_container.setHeaderDefault('modifier.noise');
        }

        // 保存历史记录
        this.historical_recorder.saveMeshSoup(this.#mesh);
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        // 调整
        const f = this.#setter.front;
        const b = this.#setter.back ;
        if (f == this.#offset_f && b == this.#offset_b) {
            return;
        } else {
            this.#offset_f = f;
            this.#offset_b = b;
        }

        // 获取soup
        let soup;

        // 如果全是 0 就回归到最初的样子
        if (f == 0 && b == 0) {
            soup = this.#soup.clone();
        } else {
            if (!this.#connector.setOffset(f, b)) {
                return;
            }
            soup = this.#connector.getResult();
        }

        // Soup 转 Mesh
        MeshFromSoup(this.#mesh, soup);

        // 更新
        this.updateWireframe(this.#soup);

        // 下一帧渲染
        this.renderNextFrame();
    }

    /**
     * 提交
     */
    #onCommit() {
        this.commit();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁
        if (this.#connector) {
            this.#connector.delete();
            this.#connector = undefined;
        }

        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}