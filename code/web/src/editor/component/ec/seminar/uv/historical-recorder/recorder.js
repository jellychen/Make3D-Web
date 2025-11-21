/* eslint-disable no-unused-vars */

import isFunction         from 'lodash/isFunction';
import HistoricalRecorder from '../../../historical-recorder';

/**
 * 最大记录
 */
const MAX_RECORDER_SIZE = 64;

/**
 * 用来精细化操作回撤数据
 */
export default class Recorder extends HistoricalRecorder {
    /**
     * 用来结论数据
     */
    #arr = [];

    /**
     * 最大记录
     */
    #max_recorder_size = MAX_RECORDER_SIZE;

    /**
     * 协调器
     */
    #ec;
    #coordinator;

    /**
     * wasm 内核
     */
    #connector;
    #connector_historic_recorder;

    /**
     * 获取
     */
    get ec() {
        return this.#ec;
    }

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get scene() {
        return this.#coordinator.scene;
    }

    /**
     * 获取
     */
    get connector_historic_recorder() {
        return this.#connector_historic_recorder;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     */
    constructor(ec, coordinator, connector) {
        super(MAX_RECORDER_SIZE);
        this.#coordinator                 = coordinator;
        this.#ec                          = ec;
        this.#connector                   = connector;
        this.#connector_historic_recorder = connector.get_historic_recorder();
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.#connector_historic_recorder.empty();
    }

    /**
     * 
     * 获取尺寸
     * 
     * @returns 
     */
    size() {
        return this.#connector_historic_recorder.size();
    }

    /**
     * 
     * 是否可以回滚
     * 
     * @returns 
     */
    canRollback() {
        return this.#connector_historic_recorder.canRollback();
    }

    /**
     * 
     * 回滚
     * 
     * @returns 
     */
    rollback() {
        const recorder = this.#connector_historic_recorder;
        if (!recorder.canRollback()) {
            return false;
        }

        if (recorder.isCurrentPlaceholder()) {
            if (this.#arr.length == 0) {
                throw new Error("inner error");
            }

            const current = this.#arr.pop();
            if (current && isFunction(current.rollback)) {
                current.rollback();
            }
        }

        recorder.rollback();
        return true;
    }

    /**
     * 
     * 添加
     * 
     * @param {*} item 
     */
    append(item) {
        const historic_recorder = this.#connector_historic_recorder;
        while (historic_recorder.size() >= this.#max_recorder_size) {
            if (historic_recorder.isFrontPlaceholder()) {
                const front = this.#arr.shift();
                if (isFunction(front.destroy)) {
                    front.destroy();
                }
            }
            historic_recorder.dimissOldeset();
        }
        this.#arr.push(item);
        historic_recorder.savePlaceholder();
    }

    /**
     * 
     * 销毁部分
     * 
     * @param {*} size 
     * @returns 
     */
    distoryUtilSize(size) {
        throw new Error("not support");
    }

    /**
     * 销毁
     */
    distory() {
        const historic_recorder = this.#connector_historic_recorder;
        while (!historic_recorder.empty()) {
            if (historic_recorder.isFrontPlaceholder()) {
                const front = this.#arr[0];
                if (isFunction(front.destroy)) {
                    front.destroy();
                }
                this.#arr.shift();
            }
            historic_recorder.dimissOldeset();
        }
    }
}
