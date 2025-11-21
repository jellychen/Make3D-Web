/* eslint-disable no-unused-vars */

import isString        from 'lodash/isString';
import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 编辑能力基类
 */
export default class Base extends EventDispatcher {
    /**
     * 协调器
     */
    coordinator;

    /**
     * 角斗场
     */
    abattoir;

    /**
     * 导航条
     */
    nav;

    /**
     * 渲染器
     */
    cinderella;
    cinderella_conf_context;

    /**
     * orbit
     */
    orbit;

    /**
     * 场景
     */
    scene;

    /**
     * 辅助场景
     */
    collaborator;

    /**
     * 部件
     */
    transformer;       // 变换组件
    haft;              // 拖柄组件
    plane_detector;    // 面侦测
    localizer;         // 游标指示器

    /**
     * 渲染器交互
     */
    interactive;
    interactive_controller;

    /**
     * 键盘监控
     */
    keyboard_watcher;

    /**
     * 获取渲染器的宽度，逻辑像素
     */
    get w() {
        return this.cinderella.getW();
    }

    /**
     * 获取渲染器的高度，逻辑像素
     */
    get h() {
        return this.cinderella.getH();
    }

    /**
     * 获取逻辑像素比
     */
    get pixel_ratio() {
        return this.cinderella.getPixelRatio();
    }

    /**
     * 获取当前使用的相机
     */
    get camera() {
        return this.cinderella.getCamera();
    }
    
    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super();
        this.coordinator             = coordinator;
        this.abattoir                = coordinator.abattoir;
        this.nav                     = coordinator.nav;
        this.cinderella              = coordinator.cinderella;
        this.cinderella_conf_context = this.cinderella.getConfContext();
        this.transformer             = this.cinderella_conf_context.transformer;
        this.haft                    = this.cinderella_conf_context.haft;
        this.plane_detector          = this.cinderella_conf_context.plane_detector;
        this.localizer               = this.cinderella_conf_context.localizer;
        this.interactive             = this.cinderella.getInteractive();
        this.interactive_controller  = this.cinderella.getInteractiveController();
        this.keyboard_watcher        = this.cinderella.getKeyboardWatcher();
        this.orbit                   = this.cinderella.getOrbit();
        this.scene                   = this.cinderella.getScene();
        this.collaborator            = this.scene.getCollaborator();
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return "";
    }

    /**
     * 
     * 获取历史记录
     * 
     * @returns 
     */
    getHistoricalRecorder() {
        return null;
    }

    /**
     * 
     * UI 坐标系转化到 NDC坐标系
     * 
     * @param {Number} value 
     */
    toNDC_X(value) {
        return this.cinderella.toNDC_X(value);
    }

    /**
     * 
     * UI 坐标系转化到 NDC坐标系
     * 
     * @param {Number} value 
     */
    toNDC_Y(value) {
        return this.cinderella.toNDC_Y(value);
    }

    /**
     * 立刻执行渲染
     */
    render() {
        this.cinderella.immediateRender();
    }

    /**
     * 
     * 设置鼠标
     * 
     * @param {string} type 
     */
    setCursor(type) {
        if (isString(type)) {
            this.abattoir.setCursor(type);
        }
    }

    /**
     * 
     * 是否开启默认的交互
     * 
     * @param {boolean} enable 
     */
    setEnableInteractive(enable) {
        this.interactive_controller.setEnable(true === enable);
    }

    /**
     * 
     * 渲染游标
     * 
     * @param {boolean} enable 
     */
    setEnableCursor(enable) {
        this.cinderella_conf_context.setEnableCursor(true === enable);
    }

    /**
     * 
     * 打开或者关闭变换组件
     * 
     * @param {boolean} enable 
     */
    setEnableTransformer(enable) {
        this.cinderella_conf_context.setEnableTransformer(true === enable);
    }

    /**
     * 
     * 开启或者关闭自定义菜单的事件捕获
     * 
     * @param {*} enable 
     */
    setEnableCustomizeMenu(enable) {
        if(enable) {
            this.abattoir.setHookCustomizeMenuCallback(event => this.onCustomizeMenu(event));
        } else {
            this.abattoir.setHookCustomizeMenuCallback();
        }
    }

    /**
     * 
     * 自定义菜单
     * 
     * @param {*} event 
     */
    onCustomizeMenu(event) {
        ;
    }

    /**
     * 
     * 接收到外部命令
     * 
     * @param {*} object 
     */
    onRecvCommand(object = undefined) {
        ;
    }

    /**
     * 执行回撤操作
     * 
     * 子类重写
     * 
     */
    rollback() {
        ;
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        this.coordinator.renderNextFrame();
    }

    /**
     * Moderator Scene的模态重置
     */
    disposeModeratorSceneModalIfHas() {
        this.coordinator.moderator.scene.dismissModal();
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}
