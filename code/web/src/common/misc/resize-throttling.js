/* eslint-disable no-unused-vars */

/**
 * 用来截流 Resize, 模拟 on_resize_begin / on_resize_end
 */
export default class ResizeThrottling {
    /**
     * 回调函数
     */
    on_resize_begin = () => { };
    on_resize_end   = () => { };

    /**
     * 定时器
     */
    #timeout_time_ms = 800;
    #timer;

    /**
     * 
     * 构造函数
     * 
     * @param {Number} timeout_time_ms 
     */
    constructor(timeout_time_ms = 800) {
        this.#timeout_time_ms = timeout_time_ms;
    }

    /**
     * 消除定时器
     */
    #clearTimer() {
        if (!this.#timer) {
            return;
        } else {
            clearTimeout(this.#timer);
            this.#timer = undefined;
        }
    }

    /**
     * 外部触发reszie事件
     */
    resize() {
        if (!this.#timer) {
            if (this.on_resize_begin) {
                this.on_resize_begin();
            }
        } else {
            this.#clearTimer();
        }

        // 设置定时器，定期检查
        this.#timer = setTimeout(() => {
            if (this.on_resize_end) {
                this.on_resize_end();
            }
            this.#timer = undefined;
        }, this.#timeout_time_ms);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#clearTimer();
    }
}
