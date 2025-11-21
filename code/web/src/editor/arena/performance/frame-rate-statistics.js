/* eslint-disable no-unused-vars */

/**
 * 帧率统计
 */
export default class FrameRateStatistics {
    /**
     * 数据
     */
    #data = new Array();

    /**
     * 
     * 添加数据
     * 
     * @param {Number} data 
     */
    push(data) {
        this.#data.push(data);
    }

    /**
     * 删除最久的
     */
    popOldest() {
        this.#data.shift();
    }

    /**
     * 
     * 获取数据的量
     * 
     * @returns 
     */
    count() {
        return this.#data.length;
    }

    /**
     * 计算均值
     */
    mean() {
        let sum = 0;
        for (let i = 0; i < this.#data.length; ++i) {
            sum += this.#data[i];
        }
        return sum / this.#data.length;
    }

    /**
     * 重置
     */
    reset() {
        this.#data.length = 0;
    }
}
