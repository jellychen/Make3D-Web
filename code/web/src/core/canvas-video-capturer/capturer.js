/* eslint-disable no-undef */

import CCapture from 'ccapture'

/**
 * 捕获视频
 */
export default class Capturer {
    /**
     * 帧率
     */
    #framerate = 30;

    /**
     * 捕获
     */
    #capturer;

    /**
     * 获取
     */
    get framerate() {
        return this.#framerate;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} framerate 
     */
    constructor(framerate = 30) {
        this.#framerate = framerate;
        this.#capturer  = new CCapture({ 
            format      : 'webm', 
            framerate 
        });
    }
    
    /**
     * 
     * 启动
     * 
     * @returns 
     */
    start() {
        this.#capturer.start();
        return this;
    }

    /**
     * 
     * 捕获
     * 
     * @param {*} canvas 
     * @returns 
     */
    capture(canvas) {
        if (canvas) {
            this.#capturer.capture(canvas);
        }
        return this;
    }

    /**
     * 
     * 终止
     * 
     * @returns 
     */
    stop() {
        this.#capturer.stop();
        return this;
    }

    /**
     * 
     * 保存
     * 
     * @returns 
     */
    async save() {
        return new Promise(resolve => {
            this.#capturer.save(blob => {
                resolve(blob);
            });
        });
    }
}