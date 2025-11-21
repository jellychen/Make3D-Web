/* eslint-disable no-unused-vars */

import isString                 from 'lodash/isString';
import isUndefined              from 'lodash/isUndefined';
import AbsoluteLocation         from '@common/misc/absolute-location';
// import TracerRenderer           from '@core/rt-renderer/tracer-renderer';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import IntroducerConf           from '@core/introducer/configure';
import OpenLathe                from '@editor/arena/lathe';
// import LoadRtDashboard          from '../rt-renderer-dashboard';
import OpenMenu                 from './v-menu';
import OpenVectorMenu           from './v-vector-menu';
import NotSupportWebGPU         from './v-not-support-webgpu';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-scene';

/**
 * 菜单项
 */
export default class BizNavToolbarScene extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * Nav
     */
    #nav;

    /**
     * 元素
     */
    #container;
    #btn_add;               // 添加按钮
    #pointer;               //
    #switcher_container;    // 切换
    #btn_svg;
    #btn_lathe;

    /**
     * 光追渲染器
     */
    #btn_rt;

    /**
     * 当前打开的光追渲染器
     */
    #rt;

    /**
     * 是否打开了光追窗口
     */
    get isOpenRTWindow() {
        return !isUndefined(this.#rt)
    }

    /**
     * 获取当前光追渲染器的窗口
     */
    get rt() {
        return this.#rt;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#host = host;
        this.#nav = coordinator.nav;
        this.setCoordinator(coordinator);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container          = this.getChild('#container');
        this.#btn_add            = this.getChild('#add');
        this.#pointer            = this.getChild('#pointer');
        this.#switcher_container = this.getChild('#switcher-container');
        this.#btn_svg            = this.getChild('#svg');
        this.#btn_lathe          = this.getChild('#lathe');
        this.#btn_rt             = this.getChild('#rt');
        this.#btn_add  .addEventListener('click', event => this.#onBtnAddClick  (event));
        this.#btn_svg  .addEventListener('click', event => this.#onBtnSvgClick  (event));
        this.#btn_rt   .addEventListener('click', event => this.#onBtnRtClick   (event));
        this.#btn_lathe.addEventListener('click', event => this.#onBtnLatheClick(event));
        this.#switcher_container.addEventListener('changed', event => this.#onSwitcherControllerChanged(event));
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this.#btn_add,            "introducer.add.geometry");
        IntroducerConf.add(this.#switcher_container, "introducer.add.geometry");
        IntroducerConf.add(this.#btn_rt,             "introducer.rt");
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 重置状态
     */
    reset() {
        this.resetSwitcherSelectedStatus();
    }

    /**
     * 重置状态
     */
    resetSwitcherSelectedStatus() {
        this.#switcher_container.select(this.#pointer);
    }

    /**
     * 
     * 点击添加按钮
     * 
     * @param {*} event 
     */
    #onBtnAddClick(event) {
        event.stopPropagation();
        OpenMenu(this.#container, (token) => {
            if (!isString(token) || !this.#coordinator) {
                return;
            }
            this.#coordinator.sendCommandToEc({
                type: token
            });
            this.resetSwitcherSelectedStatus();
        });
    }

    /**
     * 
     * 点击SVG按钮
     * 
     * @param {*} event 
     */
    #onBtnSvgClick(event) {
        this.#disposeModeratorSceneModalIfHas();
        this.#coordinator.sendCommandToEc({
            from: this.#btn_svg,
            type: 'svg',
        });
        this.resetSwitcherSelectedStatus();
    }

    /**
     * 
     * 点击车床
     * 
     * @param {*} event 
     */
    #onBtnLatheClick(event) {
        this.#disposeModeratorSceneModalIfHas();
        this.resetSwitcherSelectedStatus();
        OpenLathe(this.#coordinator);
    }

    /**
     * 
     * 点击光追渲染器
     * 
     * @param {*} event 
     */
    #onBtnRtClick(event) {
        this.#disposeModeratorSceneModalIfHas();
        this.resetSwitcherSelectedStatus();
        // if (!TracerRenderer.isSupportWebGPU()) {
        //     NotSupportWebGPU.show(this.#btn_rt);
        //     return;
        // }

        //
        // chenguodong
        //
        // 994299094@qq.com
        //
        alert("The renderer is not open source for the time being");

        // this.#rt = LoadRtDashboard(this.#coordinator);
        // this.#rt.ondismiss = () => {
        //     this.#rt = undefined;
        //     this.#coordinator.triggerNotify('rt-finish');
        // }
        // this.#coordinator.triggerNotify('rt-start');
    }

    /**
     * 
     * 头部导航条的点击变化
     * 
     * @param {*} event 
     */
    #onSwitcherControllerChanged(event) {
        this.#coordinator.sendCommandToEc({
            type: event.token
        });
    }

    /**
     * Moderator Scene的模态重置
     */
    #disposeModeratorSceneModalIfHas() {
        this.#coordinator.moderator.scene.dismissModal();
    }
}

CustomElementRegister(tagName, BizNavToolbarScene);
