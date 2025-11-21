/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IntroducerConf        from '@core/introducer/configure';
import ToolbarItem           from './v-item';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-toolbar';

/**
 * AIO Toolbar
 */
export default class Toolbar extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 页
     */
    #card_scene;
    #card_properties;
    #card_material;
    #card_light;

    /**
     * 获取
     */
    get scene() {
        return this.#card_scene;
    }

    /**
     * 获取
     */
    get properties() {
        return this.#card_properties;
    }

    /**
     * 获取
     */
    get material() {
        return this.#card_material;
    }

    /**
     * 获取
     */
    get light() {
        return this.#card_light;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container       = this.getChild("#container");
        this.#card_scene      = this.getChild("#scene");
        this.#card_properties = this.getChild("#properties");
        this.#card_material   = this.getChild("#material");
        this.#card_light      = this.getChild("#light");
        this.observerBubblesEvent("selected");
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this.#card_scene,      "introducer.scene.setter");
        IntroducerConf.add(this.#card_properties, "introducer.geometry.data.setter");
        IntroducerConf.add(this.#card_material,   "introducer.material.setter");
        IntroducerConf.add(this.#card_light,      "introducer.light.setter");
    }

    /**
     * 
     * 设置选项
     * 
     * @param {string} type 
     */
    setSelect(type) {
        switch (type) {
        case 'scene':
            this.#card_scene     .setSelected(true );
            this.#card_properties.setSelected(false);
            this.#card_material  .setSelected(false);
            this.#card_light     .setSelected(false);
            break;

        case 'properties':
            this.#card_scene     .setSelected(false);
            this.#card_properties.setSelected(true );
            this.#card_material  .setSelected(false);
            this.#card_light     .setSelected(false);
            break;

        case 'material':
            this.#card_scene     .setSelected(false);
            this.#card_properties.setSelected(false);
            this.#card_material  .setSelected(true );
            this.#card_light     .setSelected(false);
            break;

        case 'collection':
            this.#card_scene     .setSelected(false);
            this.#card_properties.setSelected(false);
            this.#card_material  .setSelected(false);
            this.#card_light     .setSelected(true );
            break;
        }
    }

    /**
     * 
     * 接收到冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        let item = event.detail;
        if (!item) {
            return;
        }

        if (!(item instanceof ToolbarItem)) {
            return;
        }

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            token: item.token
        });

        // 调整
        for (let i of this.#container.childNodes) {
            if (i == item) {
                continue;
            }

            if (isFunction(i.setSelected)) {
                i.setSelected(false);
            }
        }
    }
}

CustomElementRegister(tagName, Toolbar);
