/* eslint-disable no-unused-vars */

/**
 * 点
 */
export default class Point {
    x          = 0;
    y          = 0;
    z          = 0;
    controller = false;      // 是否是控制点
    selected   = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @param {*} controller 
     */
    constructor(x = 0, y = 0, z = 0, controller = false) {
        this.x          = x;
        this.y          = y;
        this.z          = z;
        this.controller = controller;
    }
}