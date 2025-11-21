/* eslint-disable no-unused-vars */

import FrameAnimationGenerator from '@common/misc/frame-animation-generator';
import Serializer              from '@core/serializer';

/**
 * 对场景进行打包
 */
export default class ScenePacker {
    /**
     * 回调函数
     */
    process_callback;
    process_finish_callback;

    /**
     * 场景
     */
    #scene;

    /**
     * 场景序列化
     */
    #scene_serializer;

    /**
     * 迭代器
     */
    #generator_looper;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        this.#scene = scene;
        this.#scene_serializer = new Serializer.Serializer(scene);
    }

    /**
     * 执行打包
     */
    start() {
        if (this.#generator_looper) {
            this.#generator_looper.cancel();
        }
        const generator = this.#scene_serializer.store();
        this.#generator_looper = new FrameAnimationGenerator(
            generator,
            this.process_callback,
            this.process_finish_callback);
        this.#generator_looper.start();
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#generator_looper) {
            this.#generator_looper.cancel();
            this.#generator_looper = undefined;
        }
    }
}
