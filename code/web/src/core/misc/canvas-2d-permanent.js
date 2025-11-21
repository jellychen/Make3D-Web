/* eslint-disable no-unused-vars */

/**
 * 临时的Canvas
 */
class Canvas2dPermanent {
    /**
     * 画布
     */
    #canvas;

    /**
     * 绘制上下文
     */
    #context;

    /**
     * 获取
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * 获取
     */
    get context() {
        return this.#context;
    }

    /**
     * 构造函数
     */
    constructor() {
        this.#canvas = document.createElement('canvas');
        this.#context = this.#canvas.getContext(
            '2d', 
            {
                willReadFrequently: true,
            });
    }

    /**
     * 
     * 设置尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     * @returns 
     */
    setSize(w, h) {
        this.#canvas.width  = w;
        this.#canvas.height = h;
        return this;
    }

    /**
     * 
     * 重置
     * 
     * @returns 
     */
    reset() {
        this.#canvas.width  = 0;
        this.#canvas.height = 0;
        return this;
    }

    /**
     * 
     * 清空
     * 
     * @returns 
     */
    clear() {
        const w = this.#canvas.width;
        const h = this.#canvas.height;
        this.#context.clearRect(0, 0, w, h);
        return this;
    }

    /**
     * 
     * 保存
     * 
     * @returns 
     */
    save() {
        this.#context.save();
        return this;
    }

    /**
     * 
     * 上下翻转
     * 
     * @returns 
     */
    flipY() {
        this.#context.translate(0, this.#canvas.height);
        this.#context.scale(1, -1); 
        return this;
    }

    /**
     * 
     * 绘图
     * 
     * @param  {...any} args 
     * @returns 
     */
    drawImage(...args) {
        this.#context.drawImage(...args);
        return this;
    }

    /**
     * 
     * 恢复
     * 
     * @returns 
     */
    restore() {
        this.#context.restore();
        return this;
    }

    /**
     * 
     * 转Blob
     * 
     * @param {*} callback 
     * @returns 
     */
    toBlob(callback) {
        this.#canvas.toBlob(callback);
        return this;
    }
};

export default new Canvas2dPermanent();
