/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Figma                 from '@/embed/figma';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-figma-resizer';

/**
 * Figma 窗体
 */
export default class FigmaResizer extends Element {
    /**
     * 元素
     */
    #resizer;

    /**
     * 事件回调
     */
    #pointer_down = (event) => this.#onPointerDown(event);
    #pointer_move = (event) => this.#onPointerMove(event);
    #pointer_up   = (event) => this.#onPointerUp  (event);

    /**
     * 数据
     */
    #resizing = false;

    /**
     * 数据
     */
    #init_w = 0;
    #init_h = 0;
    #init_x = 0;
    #init_y = 0;

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
        this.#resizer = this.getChild('#resizer');
        this.#resizer.addEventListener('pointerdown', (event) => this.#pointer_down(event));
        this.#resizer.addEventListener('pointermove', (event) => this.#pointer_move(event));
        this.#resizer.addEventListener('pointerup'  , (event) => this.#pointer_up  (event));
    }

    /**
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#resizing = true;
        this.#resizer.setPointerCapture(event.pointerId);
        this.#init_w = document.body.offsetWidth;
        this.#init_h = document.body.offsetHeight;
        this.#init_x = event.clientX;
        this.#init_y = event.clientY;
    }

    /**
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (this.#resizing) {
            let newW = this.#init_w + (event.clientX - this.#init_x);
            let newH = this.#init_h + (event.clientY - this.#init_y);
            newW = Math.max(newW, 800);
            newH = Math.max(newH, 400);
            Figma.invoke('resize', {
                width : newW,
                height: newH,
            });
        }
    }

    /**
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#resizing = false;
        this.#resizer.releasePointerCapture(event.pointerId);
    }
}

CustomElementRegister(tagName, FigmaResizer);