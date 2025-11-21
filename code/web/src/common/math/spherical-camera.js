/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree              from '@xthree/basic';
import Vec3                from "./vec3";
import Mat4                from "./mat4";
import SphericalCoordinate from "./spherical-coordinate";

/**
 * 临时变量
 */
const _normal = new XThree.Vector3();
const _point  = new XThree.Vector3();

/**
 * Arcball操作相机，以Target为球心
 */
export default class SphericalCamera extends SphericalCoordinate {
    /**
     * 球心
     */
    #target = new Vec3(0, 0, 0);

    /**
     * 垂直于视角向量且通过球心的面
     */
    #plane = new XThree.Plane();

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 设置看向的目标
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setTarget(x, y, z) {
        if (this.#target.x != x ||
            this.#target.y != y ||
            this.#target.z != z) {
            this.#target.x = x;
            this.#target.y = y;
            this.#target.z = z;
            return true;
        }
        return false;
    }

    /**
     * 
     * 偏移看向的目标
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    offsetTarget(x, y, z) {
        if (0 != x || 0 != y || 0 != z) {
            this.#target.x += x;
            this.#target.y += y;
            this.#target.z += z;
            return true;
        }
        return false;
    }

    /**
     * 
     * 获取看向的目标
     * 
     * @returns 
     */
    getTarget() {
        return this.#target;
    }

    /**
     * 
     * 获取相机的位置
     * 
     * @returns 
     */
    getPosition() {
        return this.getCoordinate().add(this.#target);
    }

    /**
     * 
     * 获取头向量
     * 
     * @returns 
     */
    getUp() {
        const p0 = this.getCoordinate(this.a, this.b + 0.1);
        const p1 = this.getCoordinate(this.a, this.b);
        return p0.postCross(p1.postCross(p0)).normalize();
    }

    /**
     * 从点指向相机的 单位向量
     */
    getDirFaceToCamera() {
        _normal.copy(this.getPosition());
        return _normal.sub(this.getTarget()).normalize();
    }

    /**
     * 
     * 获取视图矩阵
     * 
     * @returns 
     */
    getViewMat4() {
        const m = new Mat4();
        const p = this.getPosition();
        const t = this.getTarget();
        const u = this.getUp();
        m.lookat(p, t, u);
        return m;
    }

    /**
     * 更新平面
     */
    updatePlane() {
        const position = this.getPosition();
        _normal.x = position.x - this.#target.x;
        _normal.y = position.y - this.#target.y;
        _normal.z = position.z - this.#target.z;
        _normal.normalize();
        _point.x = this.#target.x;
        _point.y = this.#target.y;
        _point.z = this.#target.z;
        this.#plane.setFromNormalAndCoplanarPoint(_normal, _point);
    }

    /**
     * 获取看向的目标
     */
    get target() {
        return this.getTarget();
    }

    /**
     * 获取相机所在的位置
     */
    get position() {
        return this.getPosition();
    }

    /**
     * 或者头部向量
     */
    get up() {
        return this.getUp();
    }

    /**
     * 获取平面
     */
    get plane() {
        return this.#plane;
    }
}
