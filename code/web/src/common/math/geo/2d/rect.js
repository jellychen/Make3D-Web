/* eslint-disable no-undef */

export default class Rect {
    x = 0;
    y = 0;
    w = 0;
    h = 0;

    /**
     * 获取
     */
    get left() {
        return this.x;
    }

    /**
     * 获取
     */
    get top() {
        return this.y;
    }

    /**
     * 获取
     */
    get right() {
        return this.x + this.w;
    }

    /**
     * 获取
     */
    get bottom() {
        return this.y + this.h;
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.w == 0 || this.h == 0;
    }

    /**
     * 正规化
     */
    normalization() {
        if (this.w < 0) {
            this.x +=  this.w;
            this.w  = -this.w;
        }

        if (this.h < 0) {
            this.y +=  this.h;
            this.y  = -this.h;
        }
    }

    /**
     * 重置
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }

    /**
     * 
     * 扩展
     * 
     * @param {*} x 
     * @param {*} y 
     */
    expand(x, y) {
        this.normalization();

        if (x < this.x) {
            this.x = x;
        }

        if (x > this.x + this.w) {
            this.w = x - this.x;
        }

        if (y < this.y) {
            this.y = y;
        }

        if (y > this.y + this.h) {
            this.h = y - this.y;
        }
    }

    /**
     * 
     * 矩形扩展
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    expandRect(x, y, w, h) {
        this.expand(x, y);
        this.expand(x, y + h);
        this.expand(x, y + h);
        this.expand(x + w, y + h);
    }

    /**
     * 
     * 判断点是不是在rect里面
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    inPointIn(x, y) {
        if (x < this.x)          return false;
        if (x > this.x + this.w) return false;
        if (y < this.y)          return false;
        if (y > this.y + this.h) return false;
        return true;
    }

    /**
     * 
     * 判断2个rect是否碰撞
     * 
     * @param {*} rect 
     * @returns 
     */
    collision(rect) {
        if (rect.x > this.x + this.w) return false;
        if (rect.x + rect.w < this.x) return false;
        if (rect.y > this.y + this.h) return false;
        if (rect.y + rect.h < this.y) return false;
        return true;
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} rect 
     */
    copyFrom(rect) {
        this.x = rect.x;
        this.y = rect.y;
        this.w = rect.w;
        this.h = rect.h;
    }
}