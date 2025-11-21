/* eslint-disable no-unused-vars */

import isFuntion from 'lodash/isFuntion';

/**
 * 再下一帧通知我
 */
export default class CallmeNextframeAccumulation {
    /**
     * 回调
     */
    #callbacks = [];

    /**
     * 动画句柄
     */
    #frame_animation_id;

    /**
     * 
     * 回调我
     * 
     * @param {*} callback 
     */
    callme(callback) {
        if (!isFuntion(callback)) {
            return;
        } else {
            this.#callbacks.push(callback);
        }

        if (!this.#frame_animation_id) {
            this.#frame_animation_id = requestAnimationFrame(() => {
                this.#frame_animation_id = undefined;
                for (const callback of this.#callbacks) {
                    try {
                        callback();
                    } catch(e) {
                        console.error(e);
                    }
                }
                this.#callbacks.length = 0;
            });
        }
    }

    /**
     * 清除
     */
    clear() {
        if (this.#frame_animation_id) {
            cancelAnimationFrame(this.#frame_animation_id);
            this.#callbacks.length = 0;
            this.#frame_animation_id = undefined;
        }
    }
}
