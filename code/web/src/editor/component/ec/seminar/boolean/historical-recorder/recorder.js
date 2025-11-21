/* eslint-disable no-unused-vars */

import HistoricalRecorder  from '../../../historical-recorder';

/**
 * 最大记录
 */
const MAX_RECORDER_SIZE = 128;

/**
 * 用来精细化操作回撤数据
 */
export default class Recorder extends HistoricalRecorder {
    /**
     * 协调器
     */
    #ec;
    #coordinator;

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
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     */
    constructor(ec, coordinator) {
        super(MAX_RECORDER_SIZE);
        this.#ec          = ec;
        this.#coordinator = coordinator;
    }
}
