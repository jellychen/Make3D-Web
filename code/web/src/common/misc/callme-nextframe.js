/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import isFuntion   from 'lodash/isFunction';

/**
 * 再下一帧通知我
 */
export default class CallmeNextframe {
    /**
     * 回调
     */
    callback;

    /**
     * 动画句柄
     */
    #frame_animation_id;

    /**
     * 回调我
     */
    callme() {
        if (!this.#frame_animation_id) {
            this.#frame_animation_id = requestAnimationFrame(() => {
                this.#frame_animation_id = undefined;
                if (isFuntion(this.callback)) {
                    try {
                        this.callback();
                    } catch(e) {
                        console.error(e);
                    }
                }
            });
        }
    }

    /**
     * 清除
     */
    clear() {
        if (!isUndefined(this.#frame_animation_id)) {
            cancelAnimationFrame(this.#frame_animation_id);
            this.#frame_animation_id = undefined;
        }
    }
}
