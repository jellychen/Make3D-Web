/* eslint-disable no-unused-vars */

import isArray               from 'lodash/isArray';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Base                  from '../../base';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = Element.UniqueTag();

/**
 * 组件
 */
export default class Component extends Base {
    /**
     * 宿主
     */
    #panel;

    /**
     * 元素
     */
    #dot;

    /**
     * 名称
     */
    #name;

    /**
     * 获取名字
     */
    get name() {
        return this.#name;
    }

    /**
     * 获取
     */
    get is_out_port() {
        return true;
    }

    /**
     * 获取所属的panel
     */
    get panel() {
        return this.#panel;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} name 
     * @param {*} panel 
     */
    constructor(name, panel) {
        super(tagName);
        this.#name = name;
        this.#panel = panel;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#dot = this.getChild('#dot');
        this.getChild('#name').innerText = this.#name;
    }

    /**
     * 
     * 平面空间坐标, 判断是否命中 Dot
     * 
     * @param {*} x 
     * @param {*} y 
     */
    dotHittest(x, y) {
        let result = this.shadow.elementFromPoint(x, y);
        if (isArray(result) && result.length > 0) {
            result = result[0];
        }
        return result && 'dot' == result.id;
    }

    /**
     * 
     * 获取点的位置, 相当Panel父亲坐标
     * 
     * @returns 
     */
    getDotLocation() {
        let container = this.#dot.parentNode;
        let current = container;
        let x = this.#panel.x;
        let y = this.#panel.y;
        while (true) {
            x += current.offsetLeft;
            y += current.offsetTop;
            if (current == this.#panel) {
                break;
            } else {
                current = current.offsetParent;
            }
        }
        y += container.offsetHeight * 0.5;
        x += container.offsetWidth;
        return { x, y };
    }

    /**
     * 
     * 设置点高亮
     * 
     * @param {*} highlight 
     */
    setDotHighlight(highlight) {
        if (highlight) {
            this.#dot.setAttribute('highlight', 'true');
        } else {
            this.#dot.setAttribute('highlight', '');
        }
    }
}

CustomElementRegister(tagName, Component);
