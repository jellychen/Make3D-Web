/* eslint-disable no-unused-vars */

/**
 * 渲染器
 */
export default class NodesConnectionRenderer {
    /**
     * 画布
     */
    #cavnas;

    /**
     * 上下文
     */
    #dc;

    /**
     * 尺寸信息
     */
    #pixel_ratio = 1;
    #w = 0;
    #h = 0;

    /**
     * 偏移
     */
    #tx = 0;
    #ty = 0;

    /**
     * 缩放
     */
    #scale = 20;

    /**
     * 获取
     */
    get canvas() {
        return this.#cavnas;
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
        this.#cavnas = canvas;
        this.#dc = this.#cavnas.getContext("2d");
    }

    /**
     * 
     * 尺寸修改
     * 
     * @param {*} pixel_ratio 
     * @param {*} width 
     * @param {*} height 
     */
    resize(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w = width;
        this.#h = height;
    }

    /**
     * 
     * 拖动和缩放, 这是基于panZoom来实现的
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} scale 
     * @returns 
     */
    panZoom(x, y, scale) {
        if (this.#tx    != x ||
            this.#ty    != y ||
            this.#scale != scale) {
            this.#tx     = x;
            this.#ty     = y;
            this.#scale  = scale;
            return true;
        }
    }

    /**
     * 
     * 转化到UI
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    toUI(x, y) {
        x += this.#w * -0.5;
        y += this.#h * -0.5;
        x += this.#tx;
        y += this.#ty;
        x *= this.#scale;
        y *= this.#scale;
        x += this.#w * +0.5;
        y += this.#h * +0.5;
        return { x, y };
    }

    /**
     * 
     * 
     * 转化到局部
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    toLocal(x, y) {
        x += this.#w * -0.5;
        y += this.#h * -0.5;
        x *= 1.0 / this.#scale;
        y *= 1.0 / this.#scale;
        x -= this.#tx;
        y -= this.#ty;
        x += this.#w * +0.5;
        y += this.#h * +0.5;
        return { x, y };
    }

    /**
     * 开始
     */
    begin() {
        this.#dc.reset();
        this.#dc.resetTransform();
        this.#dc.scale(this.#pixel_ratio, this.#pixel_ratio);
        this.#dc.clearRect(0, 0, this.#w, this.#h);
        this.#dc.translate(this.#w * 0.5, this.#h * 0.5);
        this.#dc.scale(this.#scale, this.#scale);
        this.#dc.translate(this.#tx, this.#ty);
        this.#dc.translate(this.#w * -0.5, this.#h * -0.5);
    }

    /**
     * 渲染模拟
     */
    drawTest() {
        this.#dc.save();
        this.#dc.fillStyle = "red";
        this.#dc.fillRect(0, 0, 80, 80);
        this.#dc.restore();
    }

    /**
     * 结束
     */
    end() {
        ;
    }
}