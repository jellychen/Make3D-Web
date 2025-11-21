/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * Cubization
 */
export default class Cubization extends Base {
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
    #op_context;

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
        this.#setter.setPercent(0);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.cubization');
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupOP,
            GeoSolidSoupOP_PercentOffsetContext,
        } = Chameleon;

        // 构建
        if (!this.#soup_current) {

            // 先拷贝一份
            this.#soup_current = this.#soup.makeSnapshot();

            // 构建操作
            this.#op = new GeoSolidSoupOP(this.#soup_current.getPtr());
            this.#op_context = new GeoSolidSoupOP_PercentOffsetContext(this.#soup_current);
            this.#op.cubization(0, this.#op_context);
        }

        // 执行修改
        this.#op_context.setPercentOffset(parseFloat(this.#setter.percent));

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

        if (this.#op_context) {
            this.#op_context.delete();
            this.#op_context = undefined;
        }

        if (this.#soup_current) {
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

