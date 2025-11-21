/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import PostprocessPerformer from '../core/postprocessing/performer';

/**
 * 后处理
 */
export default class RendererPostprocess {
    /**
     * 用来执行的缓冲
     */
    #buffers;
    #postprocess_performer;

    /**
     * 
     * 构造函数
     * 
     * @param {*} buffers 
     */
    constructor(buffers) {
        this.#buffers = buffers;
        this.#postprocess_performer = new PostprocessPerformer();
    }

    /**
     * 
     * 存在后处理
     * 
     * @returns Boolean
     */
    hasPostprocess() {
        return !this.#postprocess_performer.empty();
    }

    /**
     * 
     * 执行后处理
     * 
     * @param {*} renderer 
     */
    execute(renderer) {
        this.#buffers.swapbuffers();
        this.#postprocess_performer.render(renderer, this.#buffers);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#postprocess_performer.dispose();
    }
}
