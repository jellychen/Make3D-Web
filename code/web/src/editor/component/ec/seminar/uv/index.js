/* eslint-disable no-unused-vars */

import XThree             from '@xthree/basic';
import ScopedParameters   from '@core/houdini/scoped-parameters';
import GlobalScope        from '@common/global-scope';
import Base               from '../base';
import HistoricalRecorder from './historical-recorder';
import NavToolbar         from './toolbar/v';
import ShowPresenter      from './presenter';
import Arena              from './arena';

/**
 * 临时
 */
const _vec2_0 = new XThree.Vector2();
const _vec2_1 = new XThree.Vector2();
const _mat4_0 = new XThree.Matrix4();
const _mat4_1 = new XThree.Matrix4();
const _mat4_2 = new XThree.Matrix4();
const _mat4_3 = new XThree.Matrix4();

/**
 * 控制器
 */
export default class EcUV extends Base {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 核心渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;
    #pixel_ratio = 1.0;

    /**
     * 渲染
     */
    #cinderella_renderer;

    /**
     * 渲染器配置备份
     */
    #cinderella_conf_bck;

    /**
     * 辅助场景
     */
    #collaborator;

    /**
     * 场景orbit方位
     */
    #orbit_camera_stand_controller;
    #orbit_orientation;

    /**
     * 被选中的元素
     */
    #selected_container;

    /**
     * 进行操作的元素
     */
    #object;                                        // 元素
    #object_matrix        = new XThree.Matrix4();    // 元素转化到世界坐标系
    #object_parent_matrix = new XThree.Matrix4();    // 元素父亲转化到世界坐标系

    /**
     * 操作的soup
     */
    #soup;

    /**
     * 辅助编辑显示的
     */
    #arena;

    /**
     * c++ 接口
     */
    #connector;

    /**
     * UV 展示
     */
    #presenter;

    /**
     * 事件回调
     */
    #on_click   = event => this.#onClick(event);
    #on_dbclick = event => this.#onDbClick(event);

    /**
     * 射线
     */
    #raycaster = new XThree.Raycaster();

    /**
     * 用来完成回滚的对象
     */
    #historical_recorder;

    /**
     * 获取
     */
    get object() {
        return this.#object;
    }

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#historical_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(coordinator);
        this.setEnableCustomizeMenu(true);
        this.#coordinator = coordinator;
        this.#selected_container = coordinator.selected_container; // 获取选择容器
        if (1 !== this.#selected_container.count()) {
            throw new Error('EcSculptor must only select one!')
        }

        // 获取感兴趣的元素
        this.#cinderella = coordinator.cinderella;
        this.#cinderella_renderer = this.#cinderella.getRenderer();
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#cinderella_conf_bck = this.#cinderella_conf_context.makeConfSnapshot();   // 核心渲染器配置备份
        this.#object = this.#selected_container.getOneValue();
        if (!this.#object || !this.#object.isEditableMesh) {
            throw new Error("must be editable mesh");
        }

        this.#soup = this.#object.getEditableSoup();
        this.#collaborator = this.collaborator;
        this.#orbit_camera_stand_controller = this.orbit.getCameraStandController();    // 场景orbit方位
        this.#orbit_orientation = this.orbit.backupOrientation();                       // 备份场景方位
        this.#orbit_camera_stand_controller.lookAtObject(this.#object);                 // 调整相机

        // 配置渲染器
        this.#coordinator.setEnableSelectedContainerAutoOutline(false);
        this.#cinderella_conf_context.reset();
        this.#cinderella_conf_context.setEnableRenderScene(false);
        this.#cinderella_conf_context.setEnableCursor(false);
        this.#cinderella_conf_context.setEnableCoordinate(true);

        // 获取元素的属性
        this.#object.updateWorldMatrix(true, false);
        this.#object_matrix.copy(this.#object.matrixWorld);
        this.#object_parent_matrix.copy(this.#object.getParentMatrixWorld());

        // 写入确定的信息
        GlobalScope.ChameleonScopedParameters.setMatrix(this.#object.matrixWorld);

        // 感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirUVController,
        } = Chameleon;

        // 构建角斗场
        this.#connector = new AbattoirUVController(this.#soup);

        // 初始化历史管理器
        this.#historical_recorder = new HistoricalRecorder(this, coordinator, this.#connector);

        // 配置 arena 
        this.#arena = new Arena(coordinator, this.#connector, this.#cinderella_renderer);
        this.#arena.copyMatrixFromObject(this.#object);
        this.#collaborator.attach(this.#arena); 

        // 显示 UV 展示器
        this.#presenter = ShowPresenter(this.#coordinator, this.#connector);

        // 构建导航条
        this.#nav_toolbar = new NavToolbar(this.coordinator, this.#presenter, this.#connector, this.#arena);
        this.nav.setToolbarContent(this.#nav_toolbar);

        // 监听事件
        this.interactive_controller.addEventListener('click'  , this.#on_click);
        this.interactive_controller.addEventListener('dbclick', this.#on_dbclick);

        // 执行渲染
        this.renderNextFrame();
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "uv";
    }

    /**
     * 
     * 自定义菜单
     * 
     * @param {*} event 
     */
    onCustomizeMenu(event) {
        super.onCustomizeMenu(event);
        const x = event.clientX;
        const y = event.clientY;
        this.#nav_toolbar.showMore(x, y);
    }

    /**
     * 回滚
     */
    rollback() {
        if (this.#historical_recorder.rollback()) {
            this.#arena.updateEdges();
            this.#arena.renderNextFrame();
            this.#presenter.update();
            this.#presenter.renderNextFrame();
        }
    }

    /**
     * 
     * 更新射线
     * 
     * @param {*} ray 
     * @returns 
     */
    #updateRay(ray) {
        ScopedParameters.setRay(ray);
        return this;
    }

    /**
     * 
     * 更新射线
     * 
     * @param {*} x UI 坐标系
     * @param {*} y 
     * @returns 
     */
    #updateRayFromPointer(x, y) {
        const camera = this.#cinderella.getCamera();
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        _vec2_0.x = x / w * 2.0 - 1.0;
        _vec2_0.y = 1.0 - y / h * 2.0;
        this.#raycaster.setFromCamera(_vec2_0, camera);
        this.#updateRay(this.#raycaster.ray);
        return this;
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        // UI坐标系
        const x = event.x;
        const y = event.y;

        // 更新射线
        this.#updateRayFromPointer(x, y);

        // 拾取
        if (this.#connector.pick_edge()) {
            this.#arena.updateEdges();
            this.#arena.renderNextFrame();
        }
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onDbClick(event) {
        // UI坐标系
        const x = event.x;
        const y = event.y;

        // 更新射线
        this.#updateRayFromPointer(x, y);

        // 拾取
        if (this.#connector.pick_edge_loop()) {
            this.#arena.updateEdges();
            this.#arena.renderNextFrame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁菜单回调
        this.setEnableCustomizeMenu(false);

        // 移除事件监听
        this.interactive_controller.removeEventListener('click'  , this.#on_click);
        this.interactive_controller.removeEventListener('dbclick', this.#on_dbclick);

        // 销毁
        if (this.#connector) {
            this.#connector.delete();
            this.#connector = undefined;
        }

        // abattoir 恢复
        const abattoir = this.#coordinator.abattoir;
        if (abattoir) {
            const abattoir_upper_slots = abattoir.upper_slots;
            abattoir_upper_slots.clear();
            abattoir_upper_slots.setVisible(false);
        }

        // 销毁UV展示窗口
        if (this.#presenter) {
            this.#presenter.dispose();
            this.#presenter = undefined;
        }

        // 重置渲染器的配置
        this.#coordinator.setEnableSelectedContainerAutoOutline(true);
        if (this.#cinderella_conf_bck) {
            this.#cinderella_conf_bck.makeCurrent();
        }

        // 销毁场景
        if (this.#arena) {
            this.#collaborator.detach(this.#arena);
            this.#arena.dispose();
            this.#arena = undefined;
        }

        // 恢复场景
        this.#cinderella.setOverrideScene(undefined);
        
        // 恢复方位
        this.#orbit_camera_stand_controller.toOrientation(this.#orbit_orientation);
    }
}
