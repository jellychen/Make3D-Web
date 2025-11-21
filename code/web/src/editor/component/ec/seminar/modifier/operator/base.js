/* eslint-disable no-unused-vars */

import isFunction  from 'lodash/isFunction';
import GlobalScope from '@common/global-scope';
import Wireframe   from '@core/cinderella/core/collaborator/wireframe/thin';

/**
 * 基类
 */
export default class Base {
    /**
     * 宿主
     */
    #host;

    /**
     * 协调器
     */
    #coordinator;

    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * 材质
     */
    #mesh_material;

    /**
     * 材质备份
     */
    #polygon_offset;
    #polygon_offset_factor;
    #polygon_offset_units;

    /**
     * mesh 的线框
     */
    #mesh_wireframe;
    #mesh_wireframe_builder;

    /**
     * Wasm内核
     */
    #chameleon = GlobalScope.chameleon;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * abattoir
     */
    #abattoir;

    /**
     * 渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * orbit
     */
    #orbit;

    /**
     * 场景
     */
    #scene;

    /**
     * 辅助场景
     */
    #collaborator;

    /**
     * 窗体
     */
    #setting_panel_container;

    /**
     * 访问器
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 访问器
     */
    get chameleon() {
        return this.#chameleon;
    }

    /**
     * orbit
     */
    get orbit() {
        return this.#orbit;
    }

    /**
     * 访问器
     */
    get selected_container() {
        return this.#selected_container;
    }

    /**
     * 获取中间的显示区域
     */
    get abattoir() {
        return this.#abattoir;
    }

    /**
     * 访问器
     */
    get cinderella() {
        return this.#cinderella;
    }

    /**
     * 访问器
     */
    get cinderella_conf_context() {
        return this.#cinderella_conf_context;
    }

    /**
     * 场景
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 辅助场景
     */
    get collaborator() {
        return this.#collaborator;
    }

    /**
     * 获取设置窗体
     */
    get setting_panel_container() {
        if (!this.#setting_panel_container) {
            this.#setting_panel_container = this.#coordinator.moderator.scene.showModal();
        }
        return this.#setting_panel_container;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#host.historical_recorder;
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
        this.#host                    = host;
        this.#mesh                    = mesh;
        this.#mesh_material           = mesh.material;
        this.#selected_container      = coordinator.selected_container;
        this.#coordinator             = coordinator;
        this.#abattoir                = coordinator.abattoir;
        this.#cinderella              = coordinator.cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#orbit                   = this.#cinderella.getOrbit();
        this.#scene                   = this.#cinderella.getScene();
        this.#collaborator            = this.#scene.getCollaborator();

        // 材质备份
        this.#polygon_offset        = this.#mesh_material.polygonOffset;
        this.#polygon_offset_factor = this.#mesh_material.polygonOffsetFactor;
        this.#polygon_offset_units  = this.#mesh_material.polygonOffsetUnits;

        // 设置材质的属性
        if (this.#mesh_material) {
            this.#mesh_material.polygonOffset       = true;
            this.#mesh_material.polygonOffsetFactor = 1;
            this.#mesh_material.polygonOffsetUnits  = 2;
        }

        // 添加辅助
        this.#mesh_wireframe = new Wireframe();
        this.#mesh_wireframe.setColor(0x232323);
        this.#mesh_wireframe.copyMatrixFromObject(mesh, true);
        this.#collaborator.attach(this.#mesh_wireframe);

        // 感兴趣类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupRenderableProcessorEdges,
        } = Chameleon;
        this.#mesh_wireframe_builder = GeoSolidSoupRenderableProcessorEdges.MakeShared();
    }

    /**
     * 启动
     */
    start() {
        ;
    }

    /**
     * 下一帧重绘
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 重置nav的选择
     */
    resetNavToolbar() {
        this.#coordinator.resetNavToolbar();
    }

    /**
     * 
     * 跟新
     * 
     * @param {*} soup 
     * @returns 
     */
    updateWireframe(soup) {
        if (!soup) {
            return;
        }
        this.#mesh_wireframe_builder.update(soup.getPtr());
        this.#mesh_wireframe.setLinesBuffer(this.#mesh_wireframe_builder.buffer());
        this.renderNextFrame();
    }

    /**
     * 结束提交
     */
    commit() {
        // 通知销毁
        if (this.#host && isFunction(this.#host.disposeManipulator)) {
            this.#host.disposeManipulator();
        }

        // 重置导航条
        this.resetNavToolbar();
    }

    /**
     * 
     * 销毁设置窗口
     * 
     * @param {boolean} animation 
     */
    disposeSetting(animation = true) {
        if (this.#setting_panel_container) {
            this.#setting_panel_container.dismiss(animation);
            this.#setting_panel_container = undefined;
        }
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.disposeSetting(false);

        if (this.#mesh_material) {
            this.#mesh_material.polygonOffset       = this.#polygon_offset;
            this.#mesh_material.polygonOffsetFactor = this.#polygon_offset_factor;
            this.#mesh_material.polygonOffsetUnits  = this.#polygon_offset_units;
        }

        if (this.#mesh_wireframe) {
            this.#collaborator.detach(this.#mesh_wireframe);
            this.#mesh_wireframe.dispose();
            this.#mesh_wireframe = undefined;
        }

        if (this.#mesh_wireframe_builder) {
            this.#mesh_wireframe_builder.delete();
            this.#mesh_wireframe_builder = undefined;
        }

        // 下一帧渲染
        this.renderNextFrame();
    }
}
