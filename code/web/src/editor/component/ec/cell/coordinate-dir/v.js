/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-cell-coordinate-dir';

/**
 * 用来指明坐标轴的方向
 */
export default class CoordinateDir extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #controller;
    #px;
    #nx;
    #py;
    #ny;
    #pz;
    #nz;

    /**
     * 标记类型
     */
    #token = "";

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
        this.#container  = this.getChild('#container');
        this.#name       = this.getChild('#name');
        this.#controller = this.getChild('#controller');
        this.#px         = this.getChild('#px');
        this.#py         = this.getChild('#py');
        this.#pz         = this.getChild('#pz');
        this.#nx         = this.getChild('#nx');
        this.#ny         = this.getChild('#ny');
        this.#nz         = this.getChild('#nz');
        this.#controller.addEventListener('pointerdown', event => {
            let item = event.target;
            if (!item) {
                return;
            }

            if (this.#isSelected(item)) {
                return;
            }

            this.#setSelect(this.#px, false);
            this.#setSelect(this.#py, false);
            this.#setSelect(this.#pz, false);
            this.#setSelect(this.#nx, false);
            this.#setSelect(this.#ny, false);
            this.#setSelect(this.#nz, false);

            this.#setSelect(item, true);

            // 通知
            this.#onValueChanged(item.id);
        });
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
                "default",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('default' == name) {
            this.setSelected(_new);
        }
    }

    /**
     * 
     * 设置令牌
     * 
     * @param {string} token 
     */
    setToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#token = token;
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#name.setToken(token);
    }

    /**
     * 找到选中的Item
     */
    get selected() {
        if (this.#isSelected(this.#px)) return 'px';
        if (this.#isSelected(this.#py)) return 'py';
        if (this.#isSelected(this.#pz)) return 'pz';
        if (this.#isSelected(this.#nx)) return 'nx';
        if (this.#isSelected(this.#ny)) return 'ny';
        if (this.#isSelected(this.#nz)) return 'nz';
        return undefined;
    }

    /**
     * 
     * 设置选中的Item
     * 
     * @param {string} item 
     */
    setSelected(item) {
        if (!isString(item)) {
            return;
        }

        this.#setSelect(this.#px, false);
        this.#setSelect(this.#py, false);
        this.#setSelect(this.#pz, false);
        this.#setSelect(this.#nx, false);
        this.#setSelect(this.#ny, false);
        this.#setSelect(this.#nz, false);

        if ('px' === item) this.#setSelect(this.#px, true);
        if ('py' === item) this.#setSelect(this.#py, true);
        if ('pz' === item) this.#setSelect(this.#pz, true);
        if ('nx' === item) this.#setSelect(this.#nx, true);
        if ('ny' === item) this.#setSelect(this.#ny, true);
        if ('nz' === item) this.#setSelect(this.#nz, true);
    }

    /**
     * 
     * 判断是不是旋转了
     * 
     * @param {*} item 
     * @returns 
     */
    #isSelected(item) {
        return 'true' === item.getAttribute('selected');
    }

    /**
     * 
     * 设置
     * 
     * @param {*} item 
     * @param {boolean} selected 
     */
    #setSelect(item, selected) {
        if (true === selected) {
            item.setAttribute('selected', 'true');
        } else {
            item.setAttribute('selected', 'false');
        }
    }

    /**
     * 值发生了变化
     */
    #onValueChanged(value) {
        this.bubblesEvent({
            token: this.#token,
            value: value,
        });
    }
}

CustomElementRegister(tagName, CoordinateDir);
