import { isFunction } from "lodash";

/**
 * 用来提供resize
 */
export default class Resizer {
    /**
     * 元素
     */
    #element;
    #target;

    /**
     * 数据
     */
    #target_current_w;
    #target_current_h;
    #pointer_down_client_x;
    #pointer_down_client_y;

    /**
     * 可用性
     */
    #enable_v = false;
    #enable_h = false;

    /**
     * 事件回调
     */
    #on_pointer_down    = event => this.#onPointerDown(event);
    #on_pointer_move    = event => this.#onPointerMove(event);
    #on_pointer_up      = event => this.#onPointerUp(event);
    #on_pointer_cancel  = event => this.#onPointerCancel(event);
    #on_pointer_leave   = event => this.#onPointerLeave(event);

    /**
     * 反向
     */
    #reverse = false;

    /**
     * 回调函数
     */
    on_start;
    on_process;
    on_end;

    /**
     * 
     * 构造函数
     * 
     * @param {*} element 
     * @param {*} target 
     */
    constructor(element, target) {
        this.#element = element;
        this.#target = target;
    }

    /**
     * 
     * 设置是不是反向
     * 
     * @param {boolean} reverse 
     */
    setReverse(reverse) {
        this.#reverse = reverse;
    }

    /**
     * 
     * @param {*} enable_h
     * @param {*} enable_v 
     */
    attach(enable_h = true, enable_v = true) {
        this.#enable_h = enable_h;
        this.#enable_v = enable_v;
        if (this.#enable_h || this.#enable_v) {
            this.#element.addEventListener('pointerdown', this.#on_pointer_down);
        } else {
            this.detach();
        }
    }

    /**
     * 取消
     */
    detach() {
        this.#element.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#element.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#element.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#element.removeEventListener('pointercancel', this.#on_pointer_cancel);
        this.#element.removeEventListener('pointerleave',  this.#on_pointer_leave);
    }

    /**
     * 
     * 按下
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        // 只有左键的按下才响应
        if (0 != event.button) {
            return;
        }
        this.#target_current_w = this.#target.clientWidth;
        this.#target_current_h = this.#target.clientHeight;
        this.#pointer_down_client_x = event.clientX;
        this.#pointer_down_client_y = event.clientY;
        this.#element.setPointerCapture(event.pointerId);
        this.#element.addEventListener('pointermove',   this.#on_pointer_move);
        this.#element.addEventListener('pointerup',     this.#on_pointer_up);
        this.#element.addEventListener('pointercancel', this.#on_pointer_cancel);
        this.#element.addEventListener('pointerleave',  this.#on_pointer_leave);

        // 回调
        if (isFunction(this.on_start)) {
            this.on_start();
        }
    }

    /**
     * 
     * 移动
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 横向
        if (this.#enable_h) {
            let x = event.clientX;
            let w = 0;
            if (this.#reverse) {
                w = this.#target_current_w - x + this.#pointer_down_client_x;
            } else {
                w = this.#target_current_w + x - this.#pointer_down_client_x;
            }
            this.#target.style.width = `${w}px`;
        }

        // 纵向
        if (this.#enable_v) {
            let y = event.clientY;
            let h = 0;
            if (this.#reverse) {
                h = this.#target_current_h - y + this.#pointer_down_client_y;
            } else {
                h = this.#target_current_h + y - this.#pointer_down_client_y;
            }
            this.#target.style.height = `${h}px`;
        }

        // 回调
        if (isFunction(this.on_process)) {
            this.on_process();
        }
    }

    /**
     * 
     * 抬起
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#element.releasePointerCapture(event.pointerId);
        this.#element.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#element.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#element.removeEventListener('pointercancel', this.#on_pointer_cancel);
        this.#element.removeEventListener('pointerleave',  this.#on_pointer_leave);

        // 回调
        if (isFunction(this.on_end)) {
            this.on_end();
        }
    }

    /**
     * 
     * 取消
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }
    
    /**
     * 
     * 鼠标移出
     * 
     * @param {*} event 
     */
    #onPointerLeave(event) {
        this.#onPointerUp(event);
    }
}
