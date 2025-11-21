/* eslint-disable no-unused-vars */

/**
 * 点
 */
export default class Point {
    x          = 0;
    y          = 0;
    controller = false;      // 是否是控制点
    selected   = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} controller 
     */
    constructor(x = 0, y = 0, controller = false) {
        this.x = x;
        this.y = y;
        this.controller = controller;
    }

    /**
     * 
     * 是否命中
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} tolerance 
     * @returns 
     */
    hittest(x, y, tolerance) {
        const _x = x - this.x;
        const _y = y - this.y;
        return tolerance >= Math.sqrt(_x * _x + _y * _y);
    }

    /**
     * 
     * 判断是不是在区域内
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     * @returns 
     */
    inBox(x, y, w, h) {
        if (this.x < x)     return false;
        if (this.x > x + w) return false;
        if (this.y < y)     return false;
        if (this.y > y + h) return false;
        return true;
    }
}