/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isUndefined           from 'lodash/isUndefined';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ScenePacker           from './scene-packer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-uploader';

/**
 * 数据上传服务
 */
export default class Uploader extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #close;
    #packing_data;

    /**
     * 场景打包器
     */
    #scene_packer;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.setEnableCustomizeMenu(true);
        this.#container         = this.getChild('#container');
        this.#close             = this.getChild('#close');
        this.#packing_data      = this.getChild('#title-packing-data')
        this.onclick            = event => this.blinkRedOutline();
        this.#container.onclick = event => event.stopImmediatePropagation();
        this.#close.onclick     = event => this.dispose();

        // 开始执行打包
        this.#packScene(
            object => {
                if (!isUndefined(object)) {
                    if (object.isMesh && isString(object.name)) {
                        this.#packing_data.setRaw(`File: ${object.name}`);
                    }
                }
            },
            () => {

            });
    }

    /**
     * 
     * 执行打包
     * 
     * @param {*} process_callback 
     * @param {*} process_finish_callback 
     */
    #packScene(process_callback, process_finish_callback) {
        if (this.#scene_packer) {
            this.#scene_packer.dispose();
        }
        const scene = this.#coordinator.scene;
        this.#scene_packer = new ScenePacker(scene);
        this.#scene_packer.process_callback        = process_callback;
        this.#scene_packer.process_finish_callback = process_finish_callback;
        this.#scene_packer.start();
    }

    /**
     * 
     * 显示位置
     * 
     * @param {*} reference_element 
     * @param {*} offset 
     * @param {*} dock 
     */
    show(reference_element, offset, dock = 'auto') {
        if (reference_element) {
            ComputePosition(reference_element, this.#container, dock, offset);
        }
    }

    /**
     * 红色边框闪烁一下
     */
    blinkRedOutline() {
        this.#container.setAttribute('red-outline', '');
        setTimeout(() => {
            this.#container.removeAttribute('red-outline');
        }, 300);
    }

    /**
     * 销毁
     */
    dispose() {
        this.remove();
    }
}

CustomElementRegister(tagName, Uploader);