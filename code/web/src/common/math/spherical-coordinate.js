/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Vec3 from "./vec3";

export default class SphericalCoordinate {
    /**
     * 参数
     */
    #a = 0; // x 轴逆时针，弧度制
    #b = 0; // z 轴顺时针，弧度制

    /**
     * 球的半径
     */
    #r = 100;

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 设置球的半径
     * 
     * @param {*} r 
     */
    setRadius(r) {
        if (this.#r != r) {
            this.#r = r;
            return true;
        }
        return false;
    }

    /**
     * 设置半径
     */
    set radius(r) {
        this.setRadius(r);
    }

    /**
     * 获取半径
     */
    get radius() {
        return this.#r;
    }

    /**
     * x 轴逆时针，弧度制
     */
    set a(value) {
        this.#a = value;
    }

    /**
     * x 轴逆时针
     */
    get a() {
        return this.#a;
    }

    /**
     * z 轴顺时针，弧度制
     */
    set b(value) {
        this.#b = value;
    }

    /**
     * z 轴顺时针
     */
    get b() {
        return this.#b;
    }

    /**
     * 
     * 获取当前的坐标
     * 
     * @param {*} a 
     * @param {*} b 
     * @returns 
     */
    getCoordinate(a, b) {
        a = a || this.#a;
        b = b || this.#b;
        let c = new Vec3();
        c.x = this.#r * Math.sin(b) * Math.cos(a);
        c.y = this.#r * Math.sin(b) * Math.sin(a);
        c.z = this.#r * Math.cos(b);
        return c;
    }
}
