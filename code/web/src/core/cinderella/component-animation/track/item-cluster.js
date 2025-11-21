/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import Interpolate from './interpolate';
import Item        from './item';

/**
 * 一组转态
 */
export default class ItemCluster {
    /**
     * 数组
     */
    arr = [];

    /**
     * 获取
     */
    get begin_time() {
        if (this.arr.length == 0) {
            throw new Error("arr is empty");
        }
        return this.arr[0].time;
    }

    /**
     * 获取
     */
    get end_time() {
        if (this.arr.length == 0) {
            throw new Error("arr is empty");
        }
        return this.arr[this.arr.length - 1].time;
    }

    /**
     * 
     * 是否为空
     * 
     * @returns 
     */
    empty() {
        return this.arr.length == 0;
    }

    /**
     * 按照时间的先后顺序来排序
     */
    sort() {
        this.arr.sort((a, b) => a.time - b.time);
    }

    /**
     * 检查
     */
    check() {
        for (const item of this.arr) {
            if (item instanceof Item) {
                ;
            } else {
                throw new Error("item is not instanceof Item");
            }
        }
    }

    /**
     * 
     * 找到首个比target大或者相等的元素
     * 
     * @param {*} target 
     * @returns 
     */
    findFirstGreaterOrEqual(target) {
        if (this.arr.length == 0) {
            return;
        } else if (this.arr.length == 1) {
            if (this.arr[0].time >= target) {
                return 0;
            } else {
                return;
            }
        }

        let left  = 0;
        let right = this.arr.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.arr[mid].time >= target) {
                right = mid - 1;
            } else {
                left  = mid + 1;
            }
        }
        return left < this.arr.length? left: undefined;
    }

    /**
     * 
     * 计算指定的时间的动画数据到对象， 这个是线性插值
     * 
     * @param {*} time 
     * @param {*} object 
     * @returns 
     */
    interpolate(time, object) {
        const length =  this.arr.length;
        if (length == 0) {
            return;
        }

        //
        // 情况 1
        //
        // 如果只有一个元素
        //
        if (1 == length) {
            if (time < this.arr[0].time) {
                return;
            } else {
                this.arr[0].setToObject(object);
                return;
            }
        }

        //
        // 情况 2
        //
        const hit = this.findFirstGreaterOrEqual(time);
        if (hit == 0) {
            if (time == this.arr[0].time) {
                this.arr[0].setToObject(object);
                return;
            }
            return;
        } else if (isUndefined(hit)) {
            this.arr[length - 1].setToObject(object);
            return;
        }

        //
        // 插值
        //
        const l  = hit - 1;
        const r  = hit;
        const t0 = this.arr[l].time;
        const t1 = this.arr[r].time;
        if (t0 == t1) {
            this.arr[hit].setToObject(object);
            return;
        }

        //
        // 插值写入
        //
        Interpolate(this.arr[l], this.arr[r], (time - t0) / (t1 - t0), object);
    }
}
