/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import PrepareContext from './prepare-context';

/**
 * 执行者
 */
export default class Performer {
    /**
     * 
     */
    #prepare_context = new PrepareContext();

    /**
     * 
     */
    #pipeline        = new Array();

    /**
     * 没卵用相机
     */
    #camera          = new XThree.OrthographicCamera();

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * @returns 
     */
    empty() {
        return this.#pipeline.length == 0;
    }

    /**
     * 
     * 执行处理
     * 
     * @param {*} renderer 
     * @param {*} postprocess_buffers 
     */
    render(renderer, postprocess_buffers) {
        const w = postprocess_buffers.width;
        const h = postprocess_buffers.height;
        this.#prepare_context.updateResolution(w, h);
        this.#prepare_context.updateTime();
        this.#prepare_context.updateRandom();
        for (const pass of this.#pipeline) {
            if (!pass) {
                continue;
            }
            pass.prepare(this.#prepare_context);
            pass.render(postprocess_buffers, renderer, this.#camera);
        }
    }

    /**
     * 清理
     */
    reset() {
        for (const pass of this.#pipeline) {
            if (!pass) {
                continue;
            }
            pass.dispose();
        }
        this.#pipeline.length = 0;
    }

    /**
     * 获取全部的处理管道
     */
    get pipeline() {
        return this.#pipeline;
    }

    /**
     * 销毁
     */
    dispose() {
        this.reset();
    }
}
