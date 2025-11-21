/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-boolean';

/**
 * 菜单项
 */
export default class BizNavToolbarBoolean extends Element {
    /**
     * host
     */
    #host;

    /**
     * 元素
     */
    #switcher;
    #switcher_pointer;

    /**
     * switcher 选项
     */
    #union;                 // 并集
    #a_not_b;               // 差集
    #b_not_a;               // 差集
    #intersection;          // 交集
    #xor;                   // xor

    /**
     * 布尔类型
     */
    #boolean_type = 'pointer';

    /**
     * 获取
     */
    get historical_recorder() {
        return this.#host.historical_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher         = this.getChild('#switcher');
        this.#switcher_pointer = this.getChild('#pointer');
        this.#union            = this.getChild('#union');
        this.#a_not_b          = this.getChild('#a-not-b');
        this.#b_not_a          = this.getChild('#b-not-a');
        this.#intersection     = this.getChild('#intersection');
        this.#xor              = this.getChild('#xor');
        this.#switcher.addEventListener('changed', event => this.#onSwitcherChanged(event));
    }

    /**
     * 重置
     */
    resetToDefault() {
        this.#switcher.select(this.#switcher_pointer);
    }

    /**
     * 
     * 选择
     * 
     * @param {*} token 
     */
    select(token) {
        switch(token) {
        case 'pointer':
        case 'default':
            this.#switcher.select(this.#switcher_pointer);
            this.#boolean_type = 'pointer';
            break;

        case 'union':
            this.#switcher.select(this.#union);
            this.#boolean_type = 'union';
            break;

        case 'a_not_b':
        case 'a-not-b':
            this.#switcher.select(this.#a_not_b);
            this.#boolean_type = 'a_not_b';
            break;

        case 'b_not_a':
        case 'b-not-a':
            this.#switcher.select(this.#b_not_a);
            this.#boolean_type = 'b_not_a';
            break;

        case 'intersection':
            this.#switcher.select(this.#intersection);
            this.#boolean_type = 'intersection';
            break;

        case 'xor':
            this.#switcher.select(this.#xor);
            this.#boolean_type = 'xor';
            break;
        }
    }

    /**
     * 
     * 接收 Switcher 的事件
     * 
     * @param {*} event 
     */
    #onSwitcherChanged(event) {
        const token = event.token;
        if (this.#boolean_type == token) {
            return;
        } else {
            this.historical_recorder.setBooleanMode(this.#boolean_type);
            this.#boolean_type = token;
            this.#host.setBooleanType(token);
        }
    }
}

CustomElementRegister(tagName, BizNavToolbarBoolean);
