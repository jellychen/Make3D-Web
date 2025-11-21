/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-sculptor';

/**
 * 菜单项
 */
export default class BizNavToolbarSculptor extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #k_type;
    #k_type_str;

    /**
     * 元素
     */
    #k_clay;
    #k_smooth;
    #k_drag;
    #k_crease;
    #k_flatten;
    #k_inflate;
    #k_expand;
    #k_pinch;
    #k_stack;
    #k_twist;
    #k_masking;

    /**
     * 获取
     */
    get type() {
        return this.#k_type_str;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator = undefined) {
        super(tagName);
        this.setCoordinator(coordinator);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#k_type    = this.getChild('#type');
        this.#k_clay    = this.getChild('#clay');
        this.#k_smooth  = this.getChild('#smooth');
        this.#k_drag    = this.getChild('#drag');
        this.#k_crease  = this.getChild('#crease');
        this.#k_flatten = this.getChild('#flatten');
        this.#k_inflate = this.getChild('#inflate');
        this.#k_expand  = this.getChild('#expand');
        this.#k_pinch   = this.getChild('#pinch');
        this.#k_stack   = this.getChild('#stack');
        this.#k_twist   = this.getChild('#twist');
        this.#k_masking = this.getChild('#masking');
        this.#k_type.addEventListener('changed', (event) => this.#onTypeChanged(event));
    }

    /**
     * 
     *  设置显示类型
     * 
     * @param {string} type 
     * @returns 
     */
    setType(type) {
        if (!isString(type)) {
            return;
        }

        switch (type) {
        case "clay":
            this.#k_type.select(this.#k_clay);
            this.#k_type_str = type;
            break;

        case "smooth":
            this.#k_type.select(this.#k_smooth);
            this.#k_type_str = type;
            break;
        
        case "drag":
            this.#k_type.select(this.#k_drag);
            this.#k_type_str = type;
            break;

        case "crease":
            this.#k_type.select(this.#k_crease);
            this.#k_type_str = type;
            break;

        case "flatten":
            this.#k_type.select(this.#k_flatten);
            this.#k_type_str = type;
            break;

        case "inflate":
            this.#k_type.select(this.#k_inflate);
            this.#k_type_str = type;
            break;

        case "normal":
            this.#k_type.select(this.#k_expand);
            this.#k_type_str = type;
            break;
        
        case "pinch":
            this.#k_type.select(this.#k_pinch);
            this.#k_type_str = type;
            break;

        case "stack":
            this.#k_type.select(this.#k_stack);
            this.#k_type_str = type;
            break;

        case "twist":
            this.#k_type.select(this.#k_twist);
            this.#k_type_str = type;
            break;

        case "masking":
            this.#k_type.select(this.#k_masking);
            this.#k_type_str = type;
            break;
        }
    }

    /**
     * 
     * 刻刀发生变化
     * 
     * @param {*} event 
     */
    #onTypeChanged(event) {
        const token = event.token;
        if (!isString(token) || token.length == 0) {
            return;
        }
        this.#k_type_str = token;
        this.dispatchUserDefineEvent('type-changed', { token });
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
}

CustomElementRegister(tagName, BizNavToolbarSculptor);
