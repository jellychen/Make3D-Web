/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import isString         from "lodash/isString";
import ScopedParameters from '@core/houdini/scoped-parameters';

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
 * 编辑器的基类
 */
export default class Base {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 角斗场
     */
    #abattoir

    /**
     * 宿主
     */
    #host;

    /**
     * 渲染器
     */
    #cinderella;
    #cinderella_conf_context;

    /**
     * 键盘监控
     */
    #keyboard_watcher;

    /**
     * 渲染器交互
     */
    #interactive;
    #interactive_controller;

    /**
     * 用来显示的场景树
     */
    #arena

    /**
     * 记录当前更新的相机的VP矩阵的版本
     */
    #current_camera_vp_version = undefined;

    /**
     * 射线
     */
    #raycaster = new XThree.Raycaster();

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get abattoir() {
        return this.#abattoir;
    }

    /**
     * 获取
     */
    get host() {
        return this.#host;
    }

    /**
     * 获取
     */
    get selector() {
        return this.#host.selector;
    }

    /**
     * 获取
     */
    get cinderella() {
        return this.#cinderella;
    }

    /**
     * 获取
     */
    get cinderella_conf_context() {
        return this.#cinderella_conf_context;
    }

    /**
     * 获取
     */
    get keyboard_watcher() {
        return this.#keyboard_watcher;
    }

    /**
     * 获取
     */
    get arena() {
        return this.#arena;
    }

    /**
     * 获取
     */
    get interactive() {
        return this.#interactive;
    }

    /**
     * 获取
     */
    get interactive_controller() {
        return this.#interactive_controller;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} arena 
     * @param {*} host 
     */
    constructor(coordinator, arena, host) {
        this.#coordinator             = coordinator;
        this.#arena                   = arena;
        this.#host                    = host;
        this.#abattoir                = coordinator.abattoir;
        this.#cinderella              = coordinator.cinderella;
        this.#cinderella_conf_context = this.#cinderella.getConfContext();
        this.#keyboard_watcher        = this.#cinderella.getKeyboardWatcher();
        this.#interactive             = this.#cinderella.getInteractive();
        this.#interactive_controller  = this.#cinderella.getInteractiveController();
    }

    /**
     * 
     * 设置鼠标
     * 
     * @param {string} type 
     */
    setCursor(type) {
        if (isString(type)) {
            this.#abattoir.setCursor(type);
        }
    }

    /**
     * 重置nav的选择
     */
    resetNavToolbar() {
        if (!this.#coordinator) {
            return;
        }
        this.#coordinator.resetNavToolbar();
    }

    /**
     * 
     * 是否开启选择
     * 
     * @param {boolean} enable 
     */
    setEnableSelector(enable) {
        this.#host.selector.setEnable(enable);
    }

    /**
     * 
     * 设置是否启用变换器
     * 
     * @param {boolean} enable 
     */
    setEnableSelectorTransformer(enable) {
        this.#host.selector.transformer.setEnable(enable);
    }

    /**
     * 
     * 为拾取前做准备
     * 
     * UI 坐标系
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    prepareForPicker(x, y) {
        const syncer = this.#coordinator.scoped_parameters_syncer;
        syncer.syncViewportSize()
              .syncCameraBegin()
              .syncCameraFrustumNearAndFar()
              .syncCameraRay_UIC(x, y)
              .syncCameraViewProjection()
              .syncCameraFinish();
        return this;
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 主动销毁
     * 
     * 销毁成功会内部调用 dispose
     * 
     */
    dismiss() {
        if (this.#host.manipulator === this) {
            this.#host.setupManipulatorDefault();
            this.resetNavToolbar();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        throw new Error("Should be Override!!!");
    }
}
