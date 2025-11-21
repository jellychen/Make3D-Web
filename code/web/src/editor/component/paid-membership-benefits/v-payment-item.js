/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-payment-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-benefits-payment-item';

/**
 * 支付项目
 */
export default class PaymentItem extends Element {
    /**
     * 属性
     */
    #token;
    #selected = false;
    
    /**
     * 元素
     */
    #container;
    #price;
    #period;
    #discount;

    /**
     * 获取
     */
    get token() {
        return this.#token;
    }

    /**
     * 获取
     */
    get selected() {
        return this.#selected;
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
        this.#container = this.getChild('#container');
        this.#price     = this.getChild('#price');
        this.#period    = this.getChild('#period');
        this.#discount  = this.getChild('#discount');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "price",
                "period", 
                "selected",
                "discount",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性设置
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

        if ('price' == name) {
            this.setPrice(_new);
        } else if ('period' == name) {
            this.setPeriod(_new);
        } else if ('selected' == name) {
            this.setSelected(_new == 'true');
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('discount' == name) {
            this.setDiscount(_new);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.#token = token;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setPrice(data) {
        this.#price.setRaw(data);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setPeriod(data) {
        this.#period.setRaw(data);
    }

    /**
     * 
     * 设置打折
     * 
     * @param {*} discount 
     */
    setDiscount(discount) {
        if (discount) {
            this.#discount.style.visibility = 'visible';
            this.#discount.setData(discount);
        } else {
            this.#discount.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} selected 
     */
    setSelected(selected) {
        if (this.#selected == selected) {
            return;
        } else {
            this.#selected = selected;
        }

        if (this.#selected) {
            this.#container.setAttribute('selected', '');
        } else {
            this.#container.removeAttribute('selected');
        }
    }
}

CustomElementRegister(tagName, PaymentItem);
