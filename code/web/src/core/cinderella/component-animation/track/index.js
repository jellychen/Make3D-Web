/* eslint-disable no-unused-vars */

import Tween from "@common/misc/tween";

/**
 * 关键帧
 */
export default class KeyframesTrack {
    /**
     * 关键帧
     */
    #item_clsuter;

    /**
     * 动画策略
     */
    #loop_type = '';
    #loop      = false;
    #pingpong  = false;

    /**
     * 动画
     */
    #time_range_begin;
    #time_range_end;

    /**
     * 动画的策略
     */
    #tween = new Tween();

    /**
     * 获取
     */
    get loop_type() {
        return this.#loop_type;
    }

    /**
     * 获取
     */
    get loop() {
        return this.#loop;
    }

    /**
     * 获取
     */
    get pingpong() {
        return this.#pingpong;
    }

    /**
     * 开始时间
     */
    get begin_time() {
        return this.#time_range_begin;
    }

    /**
     * 结束时间
     */
    get end_time() {
        return this.#time_range_end;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} item_cluster 
     */
    constructor(item_cluster) {
        if (!item_cluster) {
            throw new Error("item_cluster is undefined");
        }
        this.#item_clsuter     = item_cluster;
        this.#time_range_begin = item_cluster.begin_time;
        this.#time_range_end   = item_cluster.end_time;
    }

    /**
     * 
     * 设置动画
     * 
     * @param {*} type 
     */
    setTweenType(type) {
        this.#tween.setType(type);
    }

    /**
     * 
     * 设置循环类型
     * 
     * @param {*} type 
     */
    setLoopType(type) {
        switch (type) {
        case 'single' : 
            this.#loop      = false;
            this.#pingpong  = false;
            this.#loop_type = type;
            break;

        case 'pingpong' : 
            this.#loop      = false;
            this.#pingpong  = true;
            this.#loop_type = type;
            break;

        case 'loop' : 
            this.#loop      = true;
            this.#pingpong  = false;
            this.#loop_type = type;
            break;

        case 'pingpong-loop': 
            this.#loop      = true;
            this.#pingpong  = true;
            this.#loop_type = type;
            break;
        }
    }

    /**
     * 
     * 计算并设置到object上面
     * 
     * @param {*} time_ms 相对 time_range_begin 作为起点
     * @param {*} object 
     */
    calcAndSetOnObject(time_ms, object) {
        const range = (this.#time_range_end - this.#time_range_begin) * 1000;
        const time = this.#tween.calc(time_ms, 0, range, range) / 1000;
        this.#item_clsuter.interpolate(time + this.#time_range_begin, object);
    }
}
