/* eslint-disable no-unused-vars */

/**
 * 控制渲染
 */
export default class Renderer {
    /**
     * 绘图板
     */
    #canvas;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 绘制状态机
     */
    #dc;

    /**
     * 获取
     */
    get pixel_ratio() {
        return this.#pixel_ratio;
    }

    /**
     * 获取
     */
    get w() {
        return this.#w;
    }

    /**
     * 获取
     */
    get h() {
        return this.#h;
    }

    /**
     * 获取
     */
    get dc() {
        return this.#dc;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#dc = this.#canvas.getContext('2d');
    }

    /**
     * 
     * 尺寸发生了变化
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w           = width;
        this.#h           = height;
    }

    /**
     * 开始渲染
     */
    beginRender() {
        this.#dc.reset();
        this.#dc.scale(this.#pixel_ratio, this.#pixel_ratio);
        this.#dc.clearRect(0, 0, this.#w, this.#h);
        this.#dc.translate(this.#w / 2, this.#h / 2);
        this.#dc.scale(1, -1);
    }

    /**
     * 结束渲染
     */
    endRender() {
        ;
    }
}
