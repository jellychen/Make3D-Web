/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Content               from '@ux/base/content';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-arena';

/**
 * 根元素
 */
export default class Arena extends Content {
    /**
     * 元素
     */
    #date;
    #add_;
    #img_preview;
    #input;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#date        = this.getChild('#date');
        this.#add_        = this.getChild('#add');
        this.#img_preview = this.getChild('#preview');
        this.#input       = this.getChild('#input');
        this.#add_.onclick = () => this.#input.click();
        this.#date.setRaw(this.#getDateString());
        this.#input.addEventListener('change', event => this.#onInputChange(event));
    }

    /**
     * 
     * 获取日期函数
     * 
     * @returns 
     */
    #getDateString() {
        return new Date().toLocaleString('zh-CN')
    }

    /**
     * 
     * 输入
     * 
     * @param {*} event 
     */
    #onInputChange(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.#add_.remove();
        
        const reader = new FileReader();
        reader.onload = e => {
            this.#img_preview.src = e.target.result;
            this.#img_preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

CustomElementRegister(tagName, Arena);
