/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import AbsoluteLocation      from '@common/misc/absolute-location';
import Creator               from './creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-export';

/**
 * 导出
 */
export default class Export extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #content;
    #close;

    /**
     * 类型
     */
    #cls_model;
    #cls_printer3d;
    #cls_bundle;

    /**
     * 当前显示的类型
     */
    #cls;

    /**
     * cls content
     */
    #cls_content;

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
        this.#container     = this.getChild('#container');
        this.#close         = this.getChild('#close-btn');
        this.#content       = this.getChild('#content');
        this.#cls_model     = this.getChild('#model');
        this.#cls_printer3d = this.getChild('#printer3d');
        this.#cls_bundle    = this.getChild('#bundle');
        this.onclick                = event => this.#borderBlink();
        this.#container.onclick     = event => event.stopPropagation();
        this.#close.onclick         = event => this.dismiss();
        this.#cls_model.onclick     = event => this.#showDetail('model');
        this.#cls_printer3d.onclick = event => this.#showDetail('printer3d');
        this.#cls_bundle.onclick    = event => this.#showDetail('bundle');
        
        this.#showDetail('model');
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 选择
     * 
     * @param {*} element 
     * @param {*} selected 
     */
    #select(element, selected) {
        if (selected) {
            element.setAttribute('selected', '');
        } else {
            element.removeAttribute('selected');
        }
    }

    /**
     * 
     * 显示细节
     * 
     * @param {*} cls 
     * @returns 
     */
    #showDetail(cls) {
        if (this.#cls == cls) {
            return;
        } else {
            this.#cls = cls;
        }

        this.#select(this.#cls_model    , false);
        this.#select(this.#cls_printer3d, false)
        this.#select(this.#cls_bundle   , false);

        if (this.#cls_content) {
            this.#cls_content.remove();
        }

        switch(cls) {
            case 'model':
                this.#select(this.#cls_model    , true);
                break;

            case 'printer3d':
                this.#select(this.#cls_printer3d, true);
                break;

            case 'bundle':
                this.#select(this.#cls_bundle   , true);
                break;
        }

        this.#cls_content = Creator(this.#coordinator, cls);
        if (this.#cls_content) {
            this.#content.appendChild(this.#cls_content);
        }
    }

    /**
     * 边缘闪烁
     */
    #borderBlink() {
        this.#container.classList.add('highlight');
        setTimeout(() => {
            this.#container.classList.remove('highlight');
        }, 200);
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Export);
