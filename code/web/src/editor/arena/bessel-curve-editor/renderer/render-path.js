/* eslint-disable no-undef */

/**
 * 绘制的Path
 */
export default class RenderPath {
    /**
     * path
     */
    #path;

    /**
     * 上一次的结束的点
     */
    #x;
    #y;

    /**
     * 线还是点
     */
    #curve_point = true;

    /**
     * 获取路径
     */
    get path() {
        return this.#path;
    }

    /**
     * 获取
     */
    get curve_point() {
        return this.#curve_point;
    }

    /**
     * 
     * 存储线还是点
     * 
     * @param {*} curve_point 
     */
    constructor(curve_point = true) {
        this.#curve_point = curve_point;
        this.reset();
    }

    /**
     * 重置
     */
    reset() {
        this.#x = undefined;
        this.#y = undefined;
        this.#path = new Path2D();
    }

    /**
     * 
     * 添加一个曲线
     * 
     * @param {*} x0 
     * @param {*} y0 
     * @param {*} c0_x 
     * @param {*} c0_y 
     * @param {*} c1_x 
     * @param {*} c1_y 
     * @param {*} x1 
     * @param {*} y1 
     */
    addCurve(x0, y0, c0_x, c0_y, c1_x, c1_y, x1, y1) {
        if (x0 == this.#x && y0 == this.#y) {
            ;
        } else {
            this.#path.moveTo(x0, y0);
        }
        this.#path.bezierCurveTo(c0_x, c0_y, c1_x, c1_y, x1, y1);
        this.#x = x1;
        this.#y = y1;
    }

    /**
     * 
     * 添加点
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} r 
     */
    addPoint(x, y, r) {
        this.#path.roundRect(x - r, y - r, 2 * r, 2 * r, r);
        this.#x = undefined;
        this.#y = undefined;
    }
}
