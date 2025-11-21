/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IntroducerConf        from '@core/introducer/configure';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-vision';

/**
 * 用来调整视野
 */
export default class Vision extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #coordinate_2d_xy;
    #view_projection;
    #fouces;
    #take_photo;

    /**
     * token
     */
    #token = 1;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#container        = this.getChild('#container');
        this.#coordinate_2d_xy = this.getChild('#coordinate-2d-xy');
        this.#view_projection  = this.getChild('#view-projection');
        this.#fouces           = this.getChild('#focues');
        this.#take_photo       = this.getChild('#take-photo');
        this.#coordinate_2d_xy.addEventListener('pointerdown', event => this.#onClickCoordinate2d_XY(event));
        this.#view_projection .addEventListener('changed',     event => this.#onViewProjectionChanged(event));
        this.#fouces          .addEventListener('pointerdown', event => this.#onClickFouces(event));
        this.#take_photo      .addEventListener('pointerdown', event => this.#onClickTakePhoto(event));
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this, "introducer.scene.controller");
    }
    
    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        return this;
    }

    /**
     * 执行加载
     */
    load() {
        return this;
    }

    /**
     * 
     * 设置可见性
     * 
     * @param {boolean} visible 
     */
    setVisible(visible) {
        if (true === visible) {
            this.style.visibility = 'visible';
        } else {
            this.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 点击显示 XY平面
     * 
     * @param {*} event 
     */
    #onClickCoordinate2d_XY(event) {
        this.#coordinator.cinderella.getOrbit().getCameraStandController().lookAtAxisZ_N();
    }

    /**
     * 
     * 视角参数的变化
     * 
     * @param {*} event 
     */
    #onViewProjectionChanged(event) {
        let cinderella = this.#coordinator.cinderella;
        let personal_cameraman = cinderella.getPersonalCameraman();
        if (event.checked) {
            personal_cameraman.switchToPerspective();
        } else {
            personal_cameraman.switchToOrtho();
        }
    }

    /**
     * 
     * 点击对焦的按钮
     * 
     * @param {*} event 
     */
    #onClickFouces(event) {
        const orbit = this.#coordinator.cinderella.getOrbit();
        const selected_container = this.#coordinator.selected_container;
        const center = selected_container.getCenter();
        const x = center.x;
        const y = center.y;
        const z = center.z;
        orbit.getCameraStandController().moveTargetTo(x, y, z);
    }

    /**
     * 点击拍照按钮
     * 
     * @param {*} event 
     */
    #onClickTakePhoto(event) {
        this.#coordinator.cinderella.saveToPng();
    }
}

CustomElementRegister(tagName, Vision);
