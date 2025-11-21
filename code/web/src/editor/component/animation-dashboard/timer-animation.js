/* eslint-disable no-unused-vars */

import isUndefined from "lodash/isUndefined";
import Tween       from "@common/misc/tween";
import Timer       from "./timer";

/**
 * 动画定时器
 */
export default class TimerAnimation extends Timer {
    /**
     * 上下文
     */
    #context;

    /**
     * 动画，存储的单位是秒
     */
    time_range_a = 0;
    time_range_b = 2;

    /**
     * 属性
     */
    loop     = true;
    pingpong = true;

    /**
     * 动画的策略
     */
    #tween = new Tween();

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     */
    constructor(context) {
        super();
        this.#context = context;
    }

    /**
     * 
     * 设置动画曲线
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
        case 'single':
            this.loop     = false;
            this.pingpong = false;
            break;

        case 'pingpong':
            this.loop     = false;
            this.pingpong = true;
            break;

        case 'loop':
            this.loop     = true;
            this.pingpong = false;
            break;

        case 'pingpong-loop':
            this.loop     = true;
            this.pingpong = true;
            break;
        }
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

        const index  = Math.floor(time_ms / range_ms);
        const offset = time_ms - range_ms * index;
        if (!this.loop && !this.pingpong) {
            return;
        } else if (!this.loop &&  this.pingpong) {
            if (index > 1) {
                return;
            } else {
                return 2 * range_ms - time_ms;
            }
        } else if ( this.loop && !this.pingpong) {
            return offset;
        } else if ( this.loop &&  this.pingpong) {
            if (index % 2 == 0) {
                return offset;
            } else {
                return index * range_ms + range_ms - time_ms;
            }
        } 
    }

    /**
     * 移动动画到开头
     */
    #moveAnimationToStart() {
        this.#context.updateCursorTime(this.time_range_a);
        this.#context.updateAnimationAtTime(this.time_range_a);
        this.#context.makeSureTimeVisible(this.time_range_a, 20);
    }

    /**
     * 移动动画到结尾
     */
    #moveAnimationToEnd() {
        this.#context.updateCursorTime(this.time_range_b);
        this.#context.updateAnimationAtTime(this.time_range_b);
        this.#context.makeSureTimeVisible(this.time_range_b, 20);
    }

    /**
     * 
     * 收到时间回调
     * 
     * @param {*} time 
     */
    onTime(time) {
        super.onTime(time);

        // 统计
        const a = this.time_range_a * 1000;
        const b = this.time_range_b * 1000;
        const c = b - a;
        if (c <= 0) {
            this.stop();
            return;
        }

        // 重新计算
        time = this.#remapAnimationTime(c, time);
        if (isUndefined(time)) {
            if (this.pingpong) {
                this.#moveAnimationToStart();
            } else {
                this.#moveAnimationToEnd();
            }
            this.stop();
        } else {
            time = this.#tween.calc(time, 0, c, c);
            time = time / 1000 + this.time_range_a;
            this.#context.updateCursorTime(time);
            this.#context.updateAnimationAtTime(time);
            this.#context.makeSureTimeVisible(time, 20);
        }
    }
}
