/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-camera';

/**
 * 相机
 */
export default class Camera extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #axis_x;
    #axis_y;
    #axis_z;
    #coordinate_2d_xy;
    #reset;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        super.createContentFromTpl(tpl)
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container                = this.getChild('#container');
        this.#axis_x                   = this.getChild('#axis-x');
        this.#axis_y                   = this.getChild('#axis-y');
        this.#axis_z                   = this.getChild('#axis-z');
        this.#coordinate_2d_xy         = this.getChild('#coordinate-2d-xy');
        this.#reset                    = this.getChild('#reset');
        this.#axis_x.onclick           = event => this.#onClickAxisX(event);
        this.#axis_y.onclick           = event => this.#onClickAxisY(event);
        this.#axis_z.onclick           = event => this.#onClickAxisZ(event);
        this.#coordinate_2d_xy.onclick = event => this.#onClickCoordinate2d_XY(event);
        this.#reset.onclick            = event => this.#onClickReset(event);
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 执行加载
     */
    load() {
        ;
    }

    /**
     * 
     * 点击 X 
     * 
     * @param {*} event 
     */
    #onClickAxisX(event) {
        this.#coordinator.cinderella.getOrbit().getCameraStandController().lookAtAxisX_P();
    }

    /**
     * 
     * 点击 Y
     * 
     * @param {*} event 
     */
    #onClickAxisY(event) {
        this.#coordinator.cinderella.getOrbit().getCameraStandController().lookAtAxisY_P();
    }

    /**
     * 
     * 点击 Z
     * 
     * @param {*} event 
     */
    #onClickAxisZ(event) {
        this.#coordinator.cinderella.getOrbit().getCameraStandController().lookAtAxisZ_P();
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
     * 点击重置
     * 
     * @param {*} event 
     */
    #onClickReset(event) {
        this.#coordinator.cinderella.getOrbit().animationRotateToDefault();
    }

    /**
     * 更新
     */
    update() {
        
    }
}

CustomElementRegister(tagName, Camera);
