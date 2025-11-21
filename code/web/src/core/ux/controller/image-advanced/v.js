/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-image-advanced';

/**
 * 显示图片/Threejs Texture
 */
export default class ImageAdvanced extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 可能存在的元素
     */
    #img;
    #canvas_renderer;

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
    }

    /**
     * 
     * 图片的方式显示
     * 
     * @param {*} url 
     */
    setUrl(url) {
        if (this.#canvas_renderer) {
            this.#canvas_renderer.dispose();
            this.#canvas_renderer = undefined;
        }

        if (!this.#img) {
            this.#img = document.createElement('img');
            this.#img.setAttribute('draggable', 'false');
            this.#img.classList.add('item');
            this.#img.style.objectFit = 'contain';
            this.#container.appendChild(this.#img);
        }

        if (!url) {
            this.#img.style.display = 'none';
        } else {
            this.#img.src = url;
            this.#img.style.display = 'block';
        }
    }

    /**
     * 
     * 设置绘制的方式
     * 
     * @param {*} image 
     */
    setDrawableImage(image) {
        if (this.#img) {
            this.#img.remove();
            this.#img = undefined;
        }

        if (!this.#canvas_renderer) {
            this.#canvas_renderer = new Renderer();
            const element = this.#canvas_renderer.htmlDomElement;
            element.classList.add('item');
            this.#container.appendChild(element);
        }

        this.#canvas_renderer.setImage(image);
    }
}

CustomElementRegister(tagName, ImageAdvanced);
