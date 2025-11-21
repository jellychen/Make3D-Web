/* eslint-disable no-unused-vars */

/**
 * 用来记录等待被执行的队列
 */
export default class AnimationPenddingList {
    /**
     * 宿主
     */
    #host;

    /**
     * 定时器
     */
    #arr = [];

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        if (!host) {
            throw new Error("host is empty");
        }
        this.#host = host;
    }

    /**
     * 
     * @param {*} time_ms 
     * @param {*} animation_clip 
     */
    defer(time_ms, animation_clip) {
        const handle = {};
        handle.timer = setTimeout(() => {
            const index = this.#arr.indexOf(handle);
            if (index >= 0) {
                this.#arr.splice(index, 1);
            }
            this.#host.post(animation_clip, true);
        }, time_ms);
        this.#arr.push(handle);
    }

    /**
     * 清理全部在等待的动画
     */
    clear() {
        for (const item of this.#arr) {
            clearTimeout(item.timer);
        }
        this.#arr.length = 0;
    }
}
