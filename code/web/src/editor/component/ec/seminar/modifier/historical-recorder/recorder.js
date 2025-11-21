/* eslint-disable no-unused-vars */

import GlobalScope        from '@common/global-scope';
import HistoricalRecorder from '../../../historical-recorder';

/**
 * 最大记录
 */
const MAX_RECORDER_SIZE = 8;

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
     * wasm 内核
     */
    #chameleon_historic_recorder;

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
    get historic_recorder() {
        return this.#chameleon_historic_recorder.getCurrentSetup();
    }

    /**
     * 获取
     */
    get chameleon_historic_recorder() {
        return this.#chameleon_historic_recorder;
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
        this.#coordinator                 = coordinator;
        this.#ec                          = ec;
        this.#chameleon_historic_recorder = GlobalScope.chameleon.AbattoirModifierHistoricRecorder;
    }

    /**
     * 撤销最近的一次
     */
    dismissLastest() {
        throw new Error("not support");
    }
}
