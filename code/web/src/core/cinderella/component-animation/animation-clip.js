/* eslint-disable no-unused-vars */

import isUndefined from "lodash/isUndefined";

/**
 * 动画
 */
export default class Clip {
    /**
     * 动画数据
     */
    #track;

    /**
     * 动画启动时间
     */
    #animation_running_start_time = 0;

    /**
     * 动画range
     */
    #time_range_begin = 0;
    #time_range_end   = 0;

    /**
     * 是否在动画中
     */
    #is_playing = false;

    /**
     * 是否完成
     */
    get is_playing() {
        return this.#is_playing;
    }

    /**
     * 获取轨道数据
     */
    get track() {
        return this.#track;
    }

    /**
     * 
     * 获取启动的时间
     * 
     * 单位是秒
     * 
     */
    get time_begin() {
        return this.#time_range_begin;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} track 
     */
    constructor(track) {
        if (!track) {
            throw new Error("track is undefined");
        } else {
            this.#track            = track;
            this.#time_range_begin = this.#track.begin_time;
            this.#time_range_end   = this.#track.end_time;
        }
    }

    /**
     * 
     * 开始动画
     * 
     * @param {*} object 
     */
    attach(object) {
        this.#animation_running_start_time = performance.now();
        this.#is_playing = true;
    }

    /**
     * 动画结束
     */
    detach() {
        ;
    }

    /**
     * 
     * 重新计算
     * 
     * @param {*} range_ms 
     * @param {*} time_ms  动画开始到现在的时间
     */
    #remapAnimationTime(range_ms, time_ms) {
        if (time_ms <= range_ms) {
            return time_ms;
        }

        const pingpong = this.#track.pingpong;
        const loop     = this.#track.loop;
        const index    = Math.floor(time_ms / range_ms);
        const offset   = time_ms - range_ms * index;
        if (!loop && !pingpong) {
            return;
        } else if (!loop && pingpong) {
            if (index > 1) {
                return;
            } else {
                return 2 * range_ms - time_ms;
            }
        } else if (loop && !pingpong) {
            return offset;
        } else if (loop &&  pingpong) {
            if (index % 2 == 0) {
                return offset;
            } else {
                return index * range_ms + range_ms - time_ms;
            }
        } 
    }

    /**
     * 
     * 执行动画
     * 
     * @param {*} object 
     * @param {*} time 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     */
    tick(object, time, renderer, scene, camera) {
        time = time - this.#animation_running_start_time;

        // 统计
        const a = this.#time_range_begin * 1000;
        const b = this.#time_range_end   * 1000;
        const c = b - a;
        if (c <= 0) {
            this.#is_playing = false;
            return;
        }

        // 重新计算时间
        time = this.#remapAnimationTime(c, time);
        if (isUndefined(time)) {
            this.#is_playing = false;
        } else {
            this.#track.calcAndSetOnObject(time, object);
        }
    }
}