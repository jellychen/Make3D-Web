/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";
import Convert    from "./convert";
import Export     from '../model-export';

/**
 * 转换工具
 */
export default class ConvertController {
    /**
     * 当前的场景
     */
    #coordinator;

    /**
     * 执行回调函数
     */
    #on_process;
    #on_finish;

    /**
     * 下一帧回调
     */
    #animation_frame_handle;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} process_callback 
     * @param {*} finish_callback 
     */
    constructor(coordinator, process_callback, finish_callback) {
        this.#coordinator = coordinator;
        this.#on_process = process_callback;
        this.#on_finish = finish_callback;
    }

    /**
     * 
     * 处理
     * 
     * @param {*} format 
     * @param {*} selected_only 
     */
    process(format, selected_only= false) {
        const convert = new Convert(this.#coordinator);
        const count = convert.statistics(selected_only);

        // 开始迭代
        let iter = convert.process();
        let current = 0;
        const runnable = () => {
            this.#animation_frame_handle = undefined;
            const calced = iter.next();
            if (calced.done) {
                if (isFunction(this.#on_finish)) {
                    this.#on_finish();
                }
                Export(format, convert.scene);
            } else {
                this.#animation_frame_handle = 
                    requestAnimationFrame(() => runnable());
                current++;
                if (isFunction(this.#on_process)) {
                    this.#on_process(calced.value, current, count);
                }
            }
        };
        this.#animation_frame_handle 
            = requestAnimationFrame(() => runnable());
    }

    /**
     * 放弃
     */
    dispose() {
        cancelAnimationFrame(this.#animation_frame_handle);
        this.#animation_frame_handle = undefined;
    }
}
