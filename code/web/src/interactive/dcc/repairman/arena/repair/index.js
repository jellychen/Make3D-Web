/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";
import Repair     from "./repair";
import Export     from "../export";

/**
 * 转化
 */
export default class RepairController {
    /**
     * 场景
     */
    #scene;

    /**
     * 回调函数
     */
    on_process;
    on_finish;

    /**
     * 下一帧回调
     */
    #animation_frame_handle;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        this.#scene = scene;
    }

    /**
     * 
     * 处理
     * 
     * @param {*} format 
     */
    process(format) {
        const repair = new Repair(this.#scene);
        const count = repair.count;

        let iter = repair.process();
        let current = 0;
        const runnable = () => {
            this.#animation_frame_handle = undefined;
            const calced = iter.next();
            if (calced.done) {
                if (isFunction(this.on_finish)) {
                    this.on_finish();
                }
                Export(repair.scene, format);
            } else {
                this.#animation_frame_handle = requestAnimationFrame(() => runnable());
                current++;
                if (isFunction(this.on_process)) {
                    this.on_process(current, count);
                }
            }
        };
        this.#animation_frame_handle = requestAnimationFrame(() => runnable());
    }
}