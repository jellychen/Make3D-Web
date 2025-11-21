/* eslint-disable no-unused-vars */

import isString           from 'lodash/isString';
import XThree             from '@xthree/basic';
import GlobalScope        from '@common/global-scope';
import MeshFromSoup       from '@core/misc/mesh-from-soup';
import AspectColor        from '@xthree/material/aspect-color';
import HistoricalRecorder from './historical-recorder';
import NavToolbar         from './toolbar/v';
import Base               from '../base';
import OperCreator        from './oper/creator';
import Arena              from './arena';
import Selector           from './selector';
import Setter             from './setter/v';

/**
 * 拓扑编辑器
 */
export default class EcEditor extends Base {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 导航条
     */
    #nav_toolbar;

    /**
     * 通用设置面板
     */
    #setter;

    /**
     * 核心渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 键盘监控
     */
    #keyboard_watcher;

    /**
     * 键盘回调函数
     */
    #on_keyboard_command_key_changed = () => this.#onKeyboardCommandKeyChanged();

    /**
     * 场景
     */
    #scene;
    #scene_override_material_bck;       // 备份
    #scene_override_material;           // 新的

    /**
     * 渲染
     */
    #cinderella_renderer;

    /**
     * 被选中的元素
     */
    #selected_container;

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
     * 进行操作的元素
     */
    #object;                                        // 元素
    #object_matrix        = new XThree.Matrix4();   // 元素转化到世界坐标系
    #object_parent_matrix = new XThree.Matrix4();   // 元素父亲转化到世界坐标系
    #object_geometry;                               // 用来存储原来的几何

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
     * 选择器
     */
    #selector;

    /**
     * 编辑器
     */
    #manipulator_type;
    #manipulator;

    /**
     * 用来完成回滚的对象
     */
    #historical_recorder;

    /**
     * 获取当前操作的对象
     */
    get object() {
        return this.#object;
    }

    /**
     * 获取
     */
    get matrixWorld() {
        return this.#object_matrix;
    }

    /**
     * 获取
     */
    get parentMatrixWorld() {
        return this.#object_parent_matrix;
    }

    /**
     * 获取
     */
    get topoController() {
        return this.#connector;
    }

    /**
     * 获取
     */
    get arena() {
        return this.#arena;
    }

    /**
     * 获取细分等级
     */
    get subdivisionLevel() {
        return this.#arena.subdivisionLevel;
    }

    /**
     * 获取
     */
    get toolbar() {
        return this.#nav_toolbar;
    }

    /**
     * 获取
     */
    get setter() {
        return this.#setter;
    }

    /**
     * 获取
     */
    get selector() {
        return this.#selector;
    }

    /**
     * 获取
     */
    get manipulator() {
        return this.#manipulator;
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
        this.#coordinator.setEnableSelectedContainerAutoOutline(false);
        this.#selected_container = coordinator.selected_container;                              // 获取选择容器
        if (1 !== this.#selected_container.count()) {
            throw new Error('EcEditor must only select one!')
        }

        // 初始化
        this.#cinderella                  = coordinator.cinderella;                             // 核心渲染器
        this.#cinderella_renderer         = this.#cinderella.getRenderer();                     // 核心渲染器
        this.#keyboard_watcher            = this.#cinderella.getKeyboardWatcher();              // 键盘监控
        this.#scene                       = this.#cinderella.getScene();                        // 获取场景
        this.#scene_override_material_bck = this.#scene.overrideMaterial;                       // 备份场景的覆盖材质
        this.#scene_override_material     = new AspectColor();                                  // 构建新的材质
        this.#scene_override_material.setFrontColor(0x0);                                       // 配置材质
        this.#scene_override_material.setTransparent(true, 0.1);
        this.#scene_override_material.setSide(XThree.FrontSide);
        this.#scene.overrideMaterial      = this.#scene_override_material;                      // 覆盖场景材质
        this.#cinderella_conf_context     = this.#cinderella.getConfContext();                  // 核心渲染器配置
        this.#object                      = this.#selected_container.getOneValue();             // 获取在编模型
        if (!this.#object || !this.#object.isEditableMesh) {
            throw new Error("must be editable mesh");
        }

        // 渲染配置
        this.#cinderella_conf_context.save();
        this.#cinderella_conf_context.setDisableAll();
        this.#cinderella_conf_context.setEnableCoordinate(true);
        this.#cinderella_conf_context.setEnableRenderScene(true);
        this.#cinderella_conf_context.setEnableLights(false);
        this.#cinderella_conf_context.setEnableSceneShadow(false);
        this.#cinderella_conf_context.setEnableTransformerGlobal(true);
        this.#cinderella_conf_context.setEnableHaft(false);
        this.#cinderella_conf_context.setEnablePlaneDetector(false);
        this.#cinderella_conf_context.setEnableSelectBox(false);
        this.#cinderella_conf_context.setEnableOutline(false);

        // 拦截函数
        this.#coordinator.transformer_updater_hook = () => {
            this.updateSelectorTransformerIfEnable();
            return true;
        };

        this.#soup = this.#object.getEditableSoup();                                            // 获取模型的Soup
        this.#collaborator = this.collaborator;                                                 // 辅助场景
        this.#orbit_camera_stand_controller = this.orbit.getCameraStandController();            // 场景orbit方位
        this.#orbit_orientation = this.orbit.backupOrientation();                               // 备份场景方位
        this.#orbit_camera_stand_controller.lookAtObject(this.#object);                         // 调整相机

        // 显示通用菜单
        this.#setter = new Setter(coordinator, this);
        this.#coordinator.abattoir.core.appendChild(this.#setter);
        this.#coordinator.moderator.setForbidden(true);

        // 构建导航条
        this.#nav_toolbar = new NavToolbar(this.coordinator, this);
        this.nav.setToolbarContent(this.#nav_toolbar);
        
        // 监听事件
        this.#keyboard_watcher.addEventListener("command-key-changed", this.#on_keyboard_command_key_changed);

        // 配置渲染器
        this.#cinderella_conf_context.setDisableAll();

        // 获取元素的属性
        this.#object_geometry = this.#object.geometry;
        this.#object.geometry = new XThree.BufferGeometry();
        this.#object.updateWorldMatrix(true, false);
        this.#object_matrix.copy(this.#object.matrixWorld);
        this.#object_parent_matrix.copy(this.#object.getParentMatrixWorld());

        // 写入确定的信息
        GlobalScope.ChameleonScopedParameters.setMatrix(this.#object.matrixWorld);

        // 感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirTopoController,
        } = Chameleon;

        // 构建角斗场
        this.#connector = new AbattoirTopoController(this.#soup);

        // 初始化历史管理器
        this.#historical_recorder = new HistoricalRecorder(this, coordinator, this.#connector);
        
        // 配置 arena 
        this.#arena = new Arena(coordinator, this.#connector, this.#cinderella_renderer);
        this.#arena.copyMatrixFromObject(this.#object);
        this.#collaborator.attach(this.#arena);  // 替换默认的场景
        
        // 配置选择器
        this.#selector = new Selector(coordinator, this.#connector, this.#arena);
        this.#selector.setMatrix(this.#object.matrixWorld);

        // 初始化
        this.#arena.setSubdivisionLevel(0);
        this.setRenderModeAndSelectorPrimitive('v');
        this.setSelectorSeeThrough(false);

        // 设置默认的编辑器
        this.setupManipulatorDefault();

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
        return "editor";
    }

    /**
     * 
     * 接收到外部命令
     * 
     * @param {info} object 
     */
    onRecvCommand(info = undefined) {
        info = info || {};
        const c = info.cls;
        const t = info.type;
        if (!isString(c) || !isString(t)) {
            return;
        }

        if ('topo' === c) {
            this.setRenderModeAndSelectorPrimitive(t);
            this.#historical_recorder.setSelectMode(info.old_select_mode);
        } else if ('oper' === c) {
            this.setupManipulator(t);
        }
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
     * 
     * 设置显示模式
     * 
     * @param {String} mode 
     */
    setRenderMode(mode) {
        return this.#arena.setRenderMode(mode);
    }

    /**
     * 
     * 设置细分等级
     * 
     * @param {Number} level 
     */
    setSubdivisionLevel(level) {
        return this.#arena.setSubdivisionLevel(level);
    }

    /**
     * 
     * 增加基础细分
     * 
     * @param {*} count 
     * @returns 
     */
    addBaseSubdivision(count = 1) {
        if (this.#connector.subdivision(parseInt(count))) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
            return true;
        }
        return false;
    }

    /**
     * 
     * 是否显示坐标轴
     * 
     * @param {boolean} enable 
     */
    setShowCoordinate(enable) {
        if (this.#cinderella_conf_context) {
            if (enable) {
                this.#cinderella_conf_context.setEnableCoordinate(true);
            } else {
                this.#cinderella_conf_context.setEnableCoordinate(false);
            }
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 是否开启独显
     * 
     * @param {boolean} enable 
     */
    setShowOnly(enable) {
        if (this.#cinderella_conf_context) {
            if (enable) {
                this.#cinderella_conf_context.setEnableRenderScene(false);
            } else {
                this.#cinderella_conf_context.setEnableRenderScene(true);
            }
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 设置选择的基元类型
     * 
     * @param {String} mode 
     */
    setSelectorPrimitive(mode) {
        this.#nav_toolbar.setSelectMode(mode);
        if (this.#selector.setSelectorPrimitive(mode)) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
            return true;
        }
        return false;
    }

    /**
     * 
     * 设置显示模式和基元类型
     * 
     * @param {String} mode 
     */
    setRenderModeAndSelectorPrimitive(mode) {
        return this.setRenderMode(mode) || this.setSelectorPrimitive(mode);
    }

    /**
     * 
     * 开启或者关闭 透视选择
     * 
     * @param {boolean} see_through 
     */
    setSelectorSeeThrough(see_through) {
        see_through = true == see_through;
        this.#selector.setSeeThrough(see_through);  // 选择器透视
        this.#arena.setSeeThrough(see_through);     // 显示器透视
    }

    /**
     * 接收到键盘功能键变化
     */
    #onKeyboardCommandKeyChanged() {
        //
        // Shift 按键对选择的影响
        // 
        // 1. 按下: 包含选择
        // 2. 弹起: 替换选择
        //
        if (this.#keyboard_watcher.shift) {
            this.#connector.setSelectReplace(false);
        } else {
            this.#connector.setSelectReplace(true);
        }
    }

    /**
     * 设置默认的修改器
     */
    setupManipulatorDefault() {
        this.setupManipulator('basic');
    }

    /**
     * 
     * 设置使用编辑器
     * 
     * @param {String} type 
     */
    setupManipulator(type) {
        if (this.#manipulator_type === type) {
            return;
        }
        this.#manipulator_type = type;
        this.disposeManipulator();
        this.#manipulator = OperCreator(type, this.#coordinator, this.#arena, this.#connector, this);
    }

    /**
     * 更新变换
     */
    updateSelectorTransformerIfEnable() {
        this.#selector.updateSelectorTransformerIfEnable();
    }

    /**
     * 释放当前的编辑器
     */
    disposeManipulator() {
        if (this.#manipulator) {
            this.#manipulator.dispose();
            this.#manipulator = undefined;
        }
    }

    /**
     * 回撤
     */
    rollback() {
        if (this.#manipulator_type != 'basic') {
            this.setupManipulatorDefault();
            this.#nav_toolbar.reset();
        } else if (this.#historical_recorder.rollback()) {
            this.renderNextFrame();
            this.#selector.updateSelectorTransformerIfEnable();
            this.#arena.markNeedUpdate();
        }
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();

        // 销毁历史
        this.#historical_recorder.distory();

        // 销毁菜单回调
        this.setEnableCustomizeMenu(false);

        // 恢复材质
        this.#object.geometry = this.#object_geometry;

        // 获取编辑后的Soup
        const soup = this.#connector.getMeshSoup();
        if (!soup) {
            throw new Error("getMeshSoup error");
        } else {
            MeshFromSoup(this.#object, soup);
        }

        // 销毁soup
        soup.delete();

        // 销毁设置菜单
        this.#coordinator.moderator.disposeSceneContainerModal();

        // 销毁编辑器
        this.disposeManipulator();

        // 取消事件
        this.#keyboard_watcher.remove("command-key-changed", this.#on_keyboard_command_key_changed);

        // 销毁场景覆盖材质
        this.#scene.overrideMaterial = this.#scene_override_material_bck;
        if (this.#scene_override_material) {
            this.#scene_override_material.dispose();
            this.#scene_override_material = undefined;
        }

        // 销毁选择器
        if (this.#selector) {
            this.#selector.dispose();
            this.#selector = undefined;
        }

        // 重置渲染器的配置
        if (this.#cinderella_conf_context) {
            this.#cinderella_conf_context.restore();
        }

        // 销毁场景
        if (this.#arena) {
            this.#collaborator.detach(this.#arena);
            this.#arena.dispose();
            this.#arena = undefined;
        }

        // 销毁
        if (this.#connector) {
            this.#connector.delete();
            this.#connector = undefined;
        }

        // 销毁设置
        if (this.#setter) {
            this.#setter.dispose();
            this.#setter = undefined;
        }

        // 恢复场景
        this.#cinderella.setOverrideScene(undefined);

        // 恢复场景
        this.#coordinator.moderator.setForbidden(false);
        
        // 恢复方位
        this.#orbit_camera_stand_controller.toOrientation(this.#orbit_orientation);

        // 取消函数拦截
        this.#coordinator.resetAllHook();
    }
}
