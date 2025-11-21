/* eslint-disable no-unused-vars */

import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 移动
 */
export default class Moveable extends EventDispatcher {
    /**
     * 相关的元素
     */
    #target;
    #container;
    #draggable_element;

    /**
     * 回调函数
     */
    on_move_callback  = () => {};

    /**
     * 离边缘的距离 margin
     */
    adjustment_margin = 3;

    /**
     * 数据
     */
    #last_pointer_x;
    #last_pointer_y;

    /**
     * 事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;

    /**
     * 监听Container尺寸变化
     */
    #resize_observer;

    /**
     * 记录状态
     */
    #is_resizing      = false;
    #is_moving        = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} target 目标元素
     * @param {*} container 
     * @param {*} draggable_element
     */
    constructor(target, container, draggable_element = undefined) {
        super();
        this.#target            = target;
        this.#container         = container;
        this.#draggable_element = draggable_element ? draggable_element : target;
        this.#on_pointer_down   = event => this.#onPointerDown(event);
        this.#on_pointer_move   = event => this.#onPointerMove(event);
        this.#on_pointer_up     = event => this.#onPointerUp(event);
        this.#on_pointer_cancel = event => this.#onPointerCancel(event);
    }

    /**
     * 
     * 附加
     * 
     * @param {*} auto_adjustment 
     */
    attach(auto_adjustment = true) {
        this.#draggable_element.addEventListener('pointerdown', this.#on_pointer_down);
        if (auto_adjustment) {
            this.#resize_observer = new ResizeObserver(entries => {
                this.adjustment();
            });
            this.#resize_observer.observe(this.#container);
        }
    }

    /**
     * 剔除
     */
    detach() {
        if (this.#resize_observer) {
            this.#resize_observer.unobserve(this.#container);
            this.#resize_observer.disconnect();
            this.#resize_observer = undefined;
        }
        this.#draggable_element.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#draggable_element.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#draggable_element.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#draggable_element.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 自动调整的时候 margin
     * 
     * @param {Number} value 
     */
    setAdjustmentMargin(value) {
        this.adjustment_margin = value;
    }

    /**
     * 调整
     */
    adjustment() {
        let parent   = this.#container;
        let parent_w = parent.offsetWidth;
        let parent_h = parent.offsetHeight;
        let l        = this.#target.offsetLeft;
        let t        = this.#target.offsetTop;
        let w        = this.#target.offsetWidth;
        let h        = this.#target.offsetHeight;
        let old_l    = l;
        let old_t    = t;

        // 计算新的区域
        if (l < this.adjustment_margin) l = this.adjustment_margin;
        if (t < this.adjustment_margin) t = this.adjustment_margin;
        if (l + w > parent_w - this.adjustment_margin) l = parent_w - w - this.adjustment_margin;
        if (t + h > parent_h - this.adjustment_margin) t = parent_h - h - this.adjustment_margin;

        // 防止出现冗余的CSS设置
        if (l == old_l && t == old_t) {
            return;
        }

        // 调整
        this.#target.style.left = `${l}px`;
        this.#target.style.top  = `${t}px`;
        this.#target.style.removeProperty('right');
        this.#target.style.removeProperty('bottom');

        // 通知
        if (this.#target.onMove) {
            this.#target.onMove(l, t);
        }

        if (this.on_move_callback) {
            this.on_move_callback(l, t);
        }
    }

    /**
     * 
     * 事件处理函数
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        if (this.#draggable_element) {
            if (event.target != this.#draggable_element) {
                return;
            }
        }

        // 只有左键的按下才响应
        if (0 == event.button) {
            event.stopPropagation();
            this.#draggable_element.setPointerCapture(event.pointerId);
            this.#last_pointer_x = event.x;
            this.#last_pointer_y = event.y;
            this.#draggable_element.addEventListener('pointermove',   this.#on_pointer_move);
            this.#draggable_element.addEventListener('pointerup',     this.#on_pointer_up);
            this.#draggable_element.addEventListener('pointercancel', this.#on_pointer_cancel);
        }
    }

    /**
     * 
     * 事件处理函数
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (!this.#is_resizing) {
            this.#is_resizing = true;
        }
        event.stopPropagation();

        let parent           = this.#container;
        let parent_w         = parent.clientWidth;
        let parent_h         = parent.clientHeight;
        let l                = this.#target.offsetLeft;
        let t                = this.#target.offsetTop;
        let offset_x         = event.x - this.#last_pointer_x;
        let offset_y         = event.y - this.#last_pointer_y;
        this.#last_pointer_x = event.x;
        this.#last_pointer_y = event.y;
        let new_l            = l + offset_x;
        let new_t            = t + offset_y;

        // 防止移除视野
        if (new_l < this.adjustment_margin) new_l = this.adjustment_margin;
        if (new_t < this.adjustment_margin) new_t = this.adjustment_margin;
        if (new_l + this.#target.offsetWidth > parent_w - this.adjustment_margin) {
            new_l = parent_w - this.#target.offsetWidth - this.adjustment_margin;
        }

        if (new_t + this.#target.offsetHeight > parent_h - this.adjustment_margin) {
            new_t = parent_h - this.#target.offsetHeight - this.adjustment_margin;
        }

        // 防止出现冗余的变动
        if (new_l == l && new_t == t) {
            return;
        }

        if (!this.#is_moving) {
            this.#is_moving = true;

            // 触发事件
            this.dispatch("move-begin");
        }

        // 调整 CSS 属性
        this.#target.style.left = `${new_l}px`;
        this.#target.style.top  = `${new_t}px`;
        this.#target.style.removeProperty('right');
        this.#target.style.removeProperty('bottom');

        // 触发事件
        this.dispatch("move");

        // 通知
        if (this.#target.onMove) {
            this.#target.onMove(new_l, new_t);
        }

        if (this.on_move_callback) {
            this.on_move_callback(new_l, new_t);
        }
    }

    /**
     * 
     * 事件处理函数
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        event.stopPropagation();
        this.#is_resizing = false;
        this.#draggable_element.releasePointerCapture(event.pointerId);
        this.#draggable_element.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#draggable_element.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#draggable_element.removeEventListener('pointercancel', this.#on_pointer_cancel);

        // 标记转态
        this.#is_moving = false;

        // 触发事件
        this.dispatch("move-finish");
    }

    /**
     * 
     * 事件处理函数
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        event.stopPropagation();
        this.#onPointerUp(event);
    }
}
