/* eslint-disable no-undef */

// 定义
// 一秒钟滚动 280 个像素
const AUTO_SCROLL_OFFSET_PRE_SECOND = 280;

/**
 * 自动滚动
 * 
 * 1.如果在上部 15% 向下滚动
 * 2.如果在下部 15% 向上滚动
 * 
 */
export default class AutoScroller {
    /**
     * 树
     */
    #tree;

    /**
     * 需要被调节的元素
     */
    #content_container;

    /**
     * -1 表示向下滚动
     * +1 表示向上滚动
     */
    #offset_dir = 0;

    /**
     * 事件回调
     */
    #animation_handle = null;

    /**
     * 上一次滚动的
     */
    #last_scroll_time;

    /**
     * 构造函数
     * 
     * @param {*} tree 
     * @param {*} content_container 
     */
    constructor(tree, content_container) {
        if (!tree || !content_container) {
            throw new Error("tree or content_container invalid");
        }
        this.#tree = tree;
        this.#content_container = content_container;
    }

    /**
     * 
     * 当拖动的时候鼠标移动
     * 
     * @param {*} event 
     */
    onDragPointerMove(event) {
        const client_rect = this.#content_container.getBoundingClientRect();
        let client_y = event.clientY;
        if (client_y < client_rect.top) {
            this.#setNextFrameCallback();
            this.#offset_dir = -1;
        } else if (client_y > client_rect.bottom) {
            this.#setNextFrameCallback();
            this.#offset_dir = 1;
        } else {
            this.#cancleFrameCallback();
        }
    }

    /**
     * 取消滚动
     */
    cancel() {
        this.#cancleFrameCallback();
    }

    /**
     * 当拖动的时候鼠标销毁
     */
    onDragCancel() {
        this.#cancleFrameCallback();
    }

    /**
     * 
     * 下一帧回调我
     * 
     * @returns 
     */
    #setNextFrameCallback() {
        if (null != this.#animation_handle) {
            return;
        }
        this.#last_scroll_time = performance.now();
        this.#animation_handle = requestAnimationFrame((event) => this.#onFrame(event));
    }

    /**
     * 
     * 取消下一帧回调
     * 
     * @returns 
     */
    #cancleFrameCallback() {
        if (null == this.#animation_handle) {
            return;
        }
        cancelAnimationFrame(this.#animation_handle);
        this.#animation_handle = null;
    }

    /**
     * 事件回调
     */
    #onFrame(event) {
        const current_time = performance.now();
        this.#animation_handle = null;
        this.#tree.scrollOffset(this.#offset_dir * AUTO_SCROLL_OFFSET_PRE_SECOND * 
                                (current_time - this.#last_scroll_time) / 1000);
        this.#last_scroll_time = current_time;
        this.#setNextFrameCallback();
    }

    /**
     * 放弃所有任务
     */
    dismiss() {
        this.#cancleFrameCallback();
    }
}
