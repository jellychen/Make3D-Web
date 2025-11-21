/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 面板拖动
 */
export default class PanelDraggable {
    /**
     * 上下文
     */
    #context;

    /**
     * 所属面板
     */
    #panel;
    #panel_container;
    #header;

    /**
     * 鼠标位置
     */
    #x;
    #y;

    /**
     * 鼠标是否按下
     */
    #pointer_down = false;

    /**
     * 当前的位置
     */
    #pos_x = 0;
    #pos_y = 0;

    /**
     * 事件
     */
    on_drag_start;
    on_drag;
    on_drag_end;

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     * @param {*} panel 
     * @param {*} header 
     */
    constructor(context, panel, header) {
        this.#context         = context;
        this.#panel           = panel;
        this.#panel_container = panel.parent_container;
        this.#header          = header;
        this.#header.onpointerdown   = event => this.#onPointerDown  (event);
        this.#header.onpointermove   = event => this.#onPointerMove  (event);
        this.#header.onpointerup     = event => this.#onPointerUp    (event);
        this.#header.onpointercancle = event => this.#onPointerCancle(event);
    }

    /**
     * 
     * 更新位置
     * 
     * @param {*} x 
     * @param {*} y 
     */
    #updatePosition(x, y) {
        this.#panel.style.transform = `translate(${x}px, ${y}px)`;
        this.#pos_x = x;
        this.#pos_y = y;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        event.preventDefault();
        this.#header.setPointerCapture(event.pointerId);
        this.#panel.style.zIndex = parseInt(performance.now());
        this.#context.disposeZoomer();
        this.#x = event.offsetX;
        this.#y = event.offsetY;
        this.#pointer_down = true;
        if (isFunction(this.on_drag_end)) {
            this.on_drag_start();
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        event.preventDefault();
        if (!this.#pointer_down) {
            return;
        }
        const dx = event.offsetX - this.#x;
        const dy = event.offsetY - this.#y;
        const x0 = this.#pos_x + dx;
        const y0 = this.#pos_y + dy;
        this.#updatePosition(x0, y0);
        if (isFunction(this.on_drag)) {
            this.on_drag(x0, y0);
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        event.preventDefault();
        this.#header.releasePointerCapture(event.pointerId);
        this.#context.setupZoomer();
        this.#pointer_down = false;
        if (isFunction(this.on_drag_end)) {
            this.on_drag_end();
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerCancle(event) {
        this.#onPointerUp(event);
    }
}