/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 平面
 */
const PLANE_XZ = new XThree.Plane(new XThree.Vector3(0, 1, 0), 0);
const PLANE_YZ = new XThree.Plane(new XThree.Vector3(1, 0, 0), 0);

/**
 * 拾取坐标
 */
export default class Picker {
    /**
     * 暂存数据
     */
    #intersect_point = new XThree.Vector3();

    /**
     * 几何参数
     */
    #axis_len         = 0;
    #axis_radius      = 0;
    #axis_ball_radius = 0;

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 
     * 设置几何参数
     * 
     * @param {Number} len 
     */
    setAxisLen(len) {
        this.#axis_len = len;
    }

    /**
     * 
     * 设置几何参数
     * 
     * @param {Number} radius 
     */
    setAxisRadius(radius) {
        this.#axis_radius = radius;
    }

    /**
     * 
     * 设置几何参数
     * 
     * @param {Number} radius 
     */
    setAxisBallRadius(radius) {
        this.#axis_ball_radius = radius;
    }

    /**
     * 
     * 射线和面的垂直系数，越大表示越垂直
     * 
     * @param {*} ray 
     * @param {*} plane 
     * @returns 
     */
    #mass(ray, plane) {
        return Math.abs(ray.direction.dot(plane.normal));
    }

    /**
     * 
     * 判断射线和面是不是平行
     * 
     * @param {*} ray 局部坐标系
     * @param {*} plane 
     * @returns 
     */
    #isParallelPlane(ray, plane) {
        return Math.abs(ray.direction.dot(plane.normal)) < 0.000001;
    }

    /**
     * 
     * 判断射线和 haft 是不是相交
     * 
     * @param {*} ray 
     * @returns Boolean
     */
    pick(ray) {
        const total_len = this.#axis_ball_radius + this.#axis_len;
        
        // 判断 XZ 面
        if (this.#mass(ray, PLANE_XZ) > this.#mass(ray, PLANE_YZ)) {
            if (ray.intersectPlane(PLANE_XZ, this.#intersect_point)) {
                const x = this.#intersect_point.x;
                const z = this.#intersect_point.z;
                if (Math.abs(x) < this.#axis_ball_radius && z >= 0 && z < total_len) {
                    return true;
                }
            }
        }

        // 判断 YZ 面
        else {
            if (ray.intersectPlane(PLANE_YZ, this.#intersect_point)) {
                const y = this.#intersect_point.y;
                const z = this.#intersect_point.z;
                if (Math.abs(y) < this.#axis_ball_radius && z >= 0 && z < total_len) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 
     * 找到当前射线和Z轴上面交点，如果返回null，说明和Z轴平行
     * 
     * @param {*} ray 局部坐标系
     */
    pickAxisZ(ray) {
        // 判断 XZ 面
        if (this.#mass(ray, PLANE_XZ) > this.#mass(ray, PLANE_YZ)) {
            if (ray.intersectPlane(PLANE_XZ, this.#intersect_point)) {
                return this.#intersect_point.z;
            }
        }

        // 判断 YZ 面
        else {
            if (ray.intersectPlane(PLANE_YZ, this.#intersect_point)) {
                return this.#intersect_point.z;
            }
        }

        return null;
    }
}
