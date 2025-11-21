/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree    from '@xthree/basic';
import Constants from './constants';

/**
 * 平面
 */
const PLANE_XY = new XThree.Plane(new XThree.Vector3(0, 0, 1));
const PLANE_XZ = new XThree.Plane(new XThree.Vector3(0, 1, 0));
const PLANE_YZ = new XThree.Plane(new XThree.Vector3(1, 0, 0));

/**
 * 射线拾取
 */
export default class Picker {
    /**
     * 宿主
     */
    #host;
    #mesh;

    /**
     * 暂存数据
     */
    #intersect_plane   = Constants.NONE;
    #intersect_point_0 = new XThree.Vector3();
    #intersect_point_1 = new XThree.Vector3();
    #intersect_point_2 = new XThree.Vector3();

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} mesh 
     */
    constructor(host, mesh) {
        this.#host = host;
        this.#mesh = mesh;
    }

    /**
     * 
     * 判断射线和面是不是平行
     * 
     * @param {*} ray 
     * @param {*} plane 
     * @returns 
     */
    #isParallel(ray, plane) {
        return Math.abs(ray.direction.dot(plane.normal)) < 0.000001;
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

    /***
     * 获取交点
     */
    point_0() {
        return this.#intersect_point_0;
    }

    /***
     * 获取交点
     */
    point_1() {
        return this.#intersect_point_1;
    }

    /***
     * 获取交点
     */
    point_2() {
        return this.#intersect_point_2;
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickXY(ray) {
        return ray.intersectPlane(PLANE_XY, this.#intersect_point_1);
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickYZ(ray) {
        return ray.intersectPlane(PLANE_YZ, this.#intersect_point_1);
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickXZ(ray) {
        return ray.intersectPlane(PLANE_XZ, this.#intersect_point_1);
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickX(ray) {
        if (this.#mass(ray, PLANE_XY) > this.#mass(ray, PLANE_XZ)) {
            if (ray.intersectPlane(PLANE_XY, this.#intersect_point_0)) {
                return this.#intersect_point_0.x;
            }
        } else {
            if (ray.intersectPlane(PLANE_XZ, this.#intersect_point_0)) {
                return this.#intersect_point_0.x;
            }
        }

        return null;
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickY(ray) {
        if (this.#mass(ray, PLANE_XY) > this.#mass(ray, PLANE_YZ)) {
            if (ray.intersectPlane(PLANE_XY, this.#intersect_point_0)) {
                return this.#intersect_point_0.y;
            }
        } else {
            if (ray.intersectPlane(PLANE_YZ, this.#intersect_point_0)) {
                return this.#intersect_point_0.y;
            }
        }

        return null;
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pickZ(ray) {
        if (this.#mass(ray, PLANE_XZ) > this.#mass(ray, PLANE_YZ)) {
            if (ray.intersectPlane(PLANE_XZ, this.#intersect_point_0)) {
                return this.#intersect_point_0.z;
            }
        } else {
            if (ray.intersectPlane(PLANE_YZ, this.#intersect_point_0)) {
                return this.#intersect_point_0.z;
            }
        }
        return null;
    }

    /**
     * 
     * 通过射线进行拾取, ray在局部坐标系
     * 
     * @param {*} ray 
     * @returns
     */
    pick(ray) {
        // 记录在哪个面进行相交, 和交点
        this.#intersect_plane = Constants.NONE;

        // 记录
        let hit = Constants.NONE;
        let hit_distance_0 = Number.MAX_VALUE;

        // 原点
        let x0 = ray.origin.x;
        let y0 = ray.origin.y;
        let z0 = ray.origin.z;

        // 判断 XY 平面
        if (!this.#isParallel(ray, PLANE_XY)) {
            if (ray.intersectPlane(PLANE_XY, this.#intersect_point_0)) {
                let x = this.#intersect_point_0.x;
                let y = this.#intersect_point_0.y;
                let z = this.#intersect_point_0.z;
                let h = this.#mesh.pickOnPlaneXY(x, y, z);
                if (Constants.NONE != h) {
                    let d = Math.hypot(x0 - x, y0 - y, z0);
                    if (d < hit_distance_0) {
                        hit_distance_0 = d;
                        hit = h;
                        this.#intersect_plane = Constants.PLANE_XY;
                    }
                }
            }
        }

        // 判断 XZ 平面
        if (!this.#isParallel(ray, PLANE_XZ)) {
            if (ray.intersectPlane(PLANE_XZ, this.#intersect_point_0)) {
                let x = this.#intersect_point_0.x;
                let y = this.#intersect_point_0.y;
                let z = this.#intersect_point_0.z;
                let h = this.#mesh.pickOnPlaneXZ(x, y, z);
                if (Constants.NONE != h) {
                    let d = Math.hypot(x0 - x, y0, z0 - z);
                    if (d < hit_distance_0) {
                        hit_distance_0 = d;
                        hit = h;
                        this.#intersect_plane = Constants.PLANE_XZ;
                    }
                }
            }
        }

        // 判断 YZ 平面
        if (!this.#isParallel(ray, PLANE_YZ)) {
            if (ray.intersectPlane(PLANE_YZ, this.#intersect_point_0)) {
                let x = this.#intersect_point_0.x;
                let y = this.#intersect_point_0.y;
                let z = this.#intersect_point_0.z;
                let h = this.#mesh.pickOnPlaneYZ(x, y, z);
                if (Constants.NONE != h) {
                    let d = Math.hypot(x0, y0 - y, z0 - z);
                    if (d < hit_distance_0) {
                        hit_distance_0 = d;
                        hit = h;
                        this.#intersect_plane = Constants.PLANE_YZ;
                    }
                }
            }
        }
        return hit;
    }
}
