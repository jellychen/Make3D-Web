/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 默认值
 */
const DEFAULT_FOV    = 45.0;
const DEFAULT_ASPECT = 1.00;
const DEFAULT_NEAR   = 0.10;
const DEFAULT_FAR    = 300 ;

/**
 * 正交拉伸
 */
const DEFAULT_ORTHO_STRETCH = 16;

/**
 * 统一的相机换算逻辑，不计算位置和朝向，只计算透视参数
 * 
 * 这里存在一个问题需要注意：
 * 需求：
 *      在透视相机和正交相机切换的过程中，相机看向的target点处元素尺寸不发生变化
 * 
 * 问题：
 *      透视相机为主设计，正交相机为辅助相机
 *      但是从透视相机转化成正交相机的时候，为了保证目标元素尺寸的不变。
 *      会计算目标点所在透视相机视锥的截面，作为正交相机的截面
 * 
 *      这样就会导致正交相机的视锥比透视相机视锥范围很大（正交相机的视锥前后视面一样大）
 *      这样就会导致近视面出现裁剪的情况。
 * 
 *      解决方法有2个：
 *          1. 缩小正交相机的视锥，但是这样场景也会变小，在场景上面scale，但是光照会出现异常
 *          2. 把正交相机拉远点，其他的不变
 * 
 */
export default class UniformCamera {
    /**
     * 相机信息
     */
    #position = new XThree.Vector3(0, 0, 0);
    #target   = new XThree.Vector3(0, 0, 0);

    /**
     * 参数信息
     */
    #fov      = DEFAULT_FOV;
    #aspect   = DEFAULT_ASPECT;
    #near     = DEFAULT_NEAR;
    #far      = DEFAULT_FAR;

    /**
     * 临时变量
     */
    #vec3_0   = new XThree.Vector3(0, 0, 0);
    #vec3_1   = new XThree.Vector3(0, 0, 0);
    #vec3_2   = new XThree.Vector3(0, 0, 0);

    /**
     * 
     * 正交投影转透视投影
     * 
     * @param {*} camera_i 
     * @param {*} camera_o 
     * @param {Vec3} target 
     */
    static Ortho2Perspective(camera_i, camera_o, target) {
        const aspect    = camera_i.right / camera_i.top;
        const near      = camera_i.near;
        const far       = camera_i.far;
        const x         = camera_i.position.x - target.x;
        const y         = camera_i.position.y - target.y;
        const z         = camera_i.position.z - target.z;
        const l         = Math.hypot(x, y, z);
        const fov       = Math.A2D_(Math.atan(camera_i.top / l)) * 2.0;
        camera_o.up.copy(camera_i.up);
        camera_o.position.copy(camera_i.position);
        camera_o.lookAt(target.x, target.y, target.z);
        camera_o.aspect = aspect;
        camera_o.fov    = fov;
        camera_o.near   = near;
        camera_o.far    = far;
        camera_o.updateProjectionMatrix();
    }

    /**
     * 
     * 透视投影转正交投影
     * 
     * @param {*} camera_i 
     * @param {*} camera_o 
     * @param {Vec3} target 
     */
    static Perspective2Ortho(camera_i, camera_o, target) {
        const aspect    = camera_i.aspect;
        const near      = camera_i.near;
        const far       = camera_i.far;
        const fov       = camera_i.fov;
        const x         = camera_i.position.x - target.x;
        const y         = camera_i.position.y - target.y;
        const z         = camera_i.position.z - target.z;
        const l         = Math.hypot(x, y, z);
        const half_h    = l * Math.tan(Math.D2A_(fov / 2.0));
        const half_w    = half_h * aspect;
        camera_o.up.copy(camera_i.up);
        camera_o.position.copy(camera_i.position);
        camera_o.lookAt(target.x, target.y, target.z);
        camera_o.left   = -half_w;
        camera_o.right  = +half_w;
        camera_o.top    = +half_h;
        camera_o.bottom = -half_h;
        camera_o.near   = near;
        camera_o.far    = far;
        camera_o.updateProjectionMatrix();
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 重置
     */
    reset() {
        this.#fov    = DEFAULT_FOV;
        this.#aspect = DEFAULT_ASPECT;
        this.#near   = DEFAULT_NEAR;
        this.#far    = DEFAULT_FAR;
    }

    /**
     * 
     * 设置相机所在的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition(x, y, z) {
        this.#position.x = x;
        this.#position.y = y;
        this.#position.z = z;
    }

    /**
     * 
     * 设置相机看向的目标
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setTarget(x, y, z) {
        this.#target.x = x;
        this.#target.y = y;
        this.#target.z = z;
    }

    /**
     * 
     * 获取相机看到的目标
     * 
     * @returns 
     */
    getTarget() {
        return this.#target;
    }

    /**
     * 
     * 角度制
     * 
     * @param {Number} fov 
     */
    setFov(fov) {
        this.#fov = fov;
    }

    /**
     * 
     * 角度制
     * 
     * @returns 
     */
    getFov() {
        return this.#fov;
    }

    /**
     * 
     * 宽高比
     * 
     * @param {Number} aspect 
     */
    setAspect(aspect) {
        this.#aspect = aspect;
    }

    /**
     * 
     * 宽高比
     * 
     * @returns 
     */
    getAspect() {
        return this.#aspect;
    }

    /**
     * 
     * 设置前后面
     * 
     * @param {Number} near 
     * @param {Number} far 
     */
    setNearFar(near, far) {
        this.#near = near;
        this.#far  = far;
    }

    /**
     * 
     * 获取前平面
     * 
     * @returns 
     */
    getNear() {
        return this.#near;
    }

    /**
     * 获取后平面
     */
    getFar() {
        return this.#far;
    }

    /**
     * 
     * 设置数据到透视相机
     * 
     * @param {*} camera 
     */
    setInfoToPerspective(camera) {
        camera.fov    = this.#fov;
        camera.aspect = this.#aspect;
        camera.near   = this.#near;
        camera.far    = this.#far;
        camera.target = this.#target;
        camera.zoom   = 1;
        camera.position.copy(this.#position);
        camera.updateProjectionMatrix();
    }

    /**
     * 
     * 设置到正交相机
     * 
     * @param {*} camera 
     */
    setInfoToOrtho(camera) {
        const x       = this.#position.x - this.#target.x;
        const y       = this.#position.y - this.#target.y;
        const z       = this.#position.z - this.#target.z;
        const l       = Math.hypot(x, y, z);
        const half_h  = Math.tan(Math.D2A_(this.#fov) / 2.0) * l;
        const half_w  = this.#aspect * half_h;
        const vec3    = this.#vec3_0.copy(this.#position)
                                    .sub(this.#target)
                                    .normalize()
                                    .multiplyScalar(l * DEFAULT_ORTHO_STRETCH);
        camera.left   = -half_w;
        camera.right  = +half_w;
        camera.top    = +half_h;
        camera.bottom = -half_h;
        camera.near   = this.#near;
        camera.far    = this.#far * DEFAULT_ORTHO_STRETCH;
        camera.fov    = this.#fov;
        camera.target = this.#target;
        camera.zoom   = 1;
        camera.position.copy(this.#position);
        camera.position.add(vec3);
        camera.updateProjectionMatrix();
    }
}
