/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';

/**
 * 定时器
 */
export default class Timer {
    /**
     * 回调
     */
    on_start;
    callback;
    on_end;

    /**
     * 回调句柄
     */
    #animation_frame_id;

    /**
     * 启动的时间
     */
    #start_time;

    /**
     * 启动
     */
    start() {
        if (this.#animation_frame_id) {
            throw new Error("AnimationFrame already start");
        }
        this.#start_time = performance.now();
        const animation = () => {
            this.#animation_frame_id = requestAnimationFrame(animation);
            this.onTime(performance.now() - this.#start_time);
        }
        this.#animation_frame_id = requestAnimationFrame(animation);
        this.onStart();
    }

    /**
     * 启动
     */
    onStart() {
        if (isFunction(this.on_start)) {
            try {
                this.on_start();
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 
     * 收到时间回调
     * 
     * @param {*} time 
     */
    onTime(time) {
        if (isFunction(this.callback)) {
            try {
                this.callback(time);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 终止
     */
    onEnd() {
        if (isFunction(this.on_end)) {
            try {
                this.on_end();
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 终止
     */
    stop() {
        if (this.#animation_frame_id) {
            cancelAnimationFrame(this.#animation_frame_id);
            this.#animation_frame_id = undefined;
            this.onEnd();
        }
    }
}
