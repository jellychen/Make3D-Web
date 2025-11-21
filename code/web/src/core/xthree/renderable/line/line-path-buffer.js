/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 收集线段，每2个点构建一个线段
 */
export default class LinePathBuffer {
    /**
     * 数据
     */
    #buffer;

    /**
     * 
     * 初始化指定线段的数量
     * 
     * @param {Number} segments_count 
     */
    constructor(segments_count) {
        this.#buffer = new Float32Array(segments_count * 3 * 2);
    }

    /**
     * 
     * 设置指定序列的线段
     * 
     * @param {Number} index 
     * @param {Number} x0 
     * @param {Number} y0 
     * @param {Number} z0 
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} z1 
     */
    setSegment(index, x0, y0, z0, x1, y1, z1) {
        let offset = index * 6;
        this.#buffer[offset + 0] = x0;
        this.#buffer[offset + 1] = y0;
        this.#buffer[offset + 2] = z0;
        this.#buffer[offset + 3] = x1;
        this.#buffer[offset + 4] = y1;
        this.#buffer[offset + 5] = z1;

        return this;
    }
}
