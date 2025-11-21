/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * Noise
 */
export default class Noise extends Base {
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
    #soup_current;

    /**
     * 操作
     */
    #op;

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
        this.#setter = new Setter(
            this, 
            () => this.#onSetterChanged(),
            () => this.#onCommit());
        this.#setter.setSigma(0);
        this.#setter.setAmplitude(0);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.noise');
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupOP,
        } = Chameleon;

        // 先拷贝一份
        if (this.#soup_current) {
            this.#soup_current.delete();
        }

        this.#soup_current = this.#soup.makeSnapshot();

        // 构建
        if (!this.#op) {
            this.#op = new GeoSolidSoupOP(this.#soup_current.getPtr());
        } else {
            this.#op.setSoup(this.#soup_current.getPtr());
        }

        // 参数
        const sigma     = this.#setter.sigma     / 100;
        const amplitude = this.#setter.amplitude / 100;
        this.#op.noiseGaussian(sigma, amplitude);

        // Soup 转 Mesh
        MeshFromSoup(this.#mesh, this.#soup_current);

        // 更新
        this.updateWireframe(this.#soup_current);

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

        if (this.#op) {
            this.#op.delete();
            this.#op = undefined;
        }

        if (this.#soup_current) {
            this.#mesh.setEditableSoup(this.#soup_current);
            this.#soup_current.delete();
            this.#soup_current = undefined;
        }

        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        if (this.#setter) {
            this.#setter.dispose();
            this.#setter = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}
