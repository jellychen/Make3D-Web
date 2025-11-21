/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import Wireframe    from '@core/cinderella/core/collaborator/wireframe/thin';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * Subdivision
 */
export default class Subdivision extends Base {
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
        this.#setter.setCount(0);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('modifier.subdivision');
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupSubdivisionSimpleCoplanar,
            GeoSolidSoupSubdivision,
        } = Chameleon;

        // 用来创造细分的结果
        if (!this.#soup_current) {
            this.#soup_current = GeoSolidSoup.MakeShared(); 
        }

        // 获取参数
        const count = this.#setter.count;
        const classes = this.#setter.classes;

        // 如果 0 细分
        if (0 == count) {
            this.updateWireframe(this.#soup);
            MeshFromSoup(this.#mesh, this.#soup);
            this.renderNextFrame();
            return;
        }

        // 平滑细分
        if ('cc' == classes) {
            const soup = this.#soup_current;
            GeoSolidSoupSubdivision.Perform(
                this.#soup.getPtr(), soup.getPtr(), count);
            this.updateWireframe(soup);
            MeshFromSoup(this.#mesh, soup);
            this.renderNextFrame();
        } 
        
        // 简单细分
        else if ('simple' == classes) {
            const soup = this.#soup_current;
            GeoSolidSoupSubdivisionSimpleCoplanar.Perform(
                this.#soup.getPtr(), soup.getPtr(), count);
            this.updateWireframe(soup);
            MeshFromSoup(this.#mesh, soup);
            this.renderNextFrame();
        }
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

        if (this.#soup_current) {
            if (0 == this.#setter.count) {
                this.#soup_current.delete();
                this.#soup_current = undefined;
            } else {
                this.#soup_current.delete();
                this.#soup_current = undefined;
            }
        }

        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}
