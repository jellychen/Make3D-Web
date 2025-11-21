/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isNumber    from 'lodash/isNumber';
import isObject    from 'lodash/isObject';
import * as TWEEN  from '@tweenjs/tween.js';
import XThree      from '@xthree/basic';
import Orientation from './orientation';

/**
 * 缓动动画的时间
 */
const TWEEN_EASING_TIME = 600;

/**
 * 机位控制器
 */
export default class CameraStandController {
    /**
     * 核心
     */
    #isolate;

    /**
     * 机位
     */
    #orbit;
    
    /**
     * 监听渲染的开始事件
     */
    #on_frame_begin = event => this.#onFrameBegin(event);

    /**
     * 缓动
     */
    #tween;

    /**
     * 临时变量
     */
    #vec3_0 = new XThree.Vector3(0, 0, 0);
    #vec3_1 = new XThree.Vector3(0, 0, 0);

    /**
     * 临时变量
     */
    #orientation = new Orientation();

    /**
     * 
     * 构造函数
     * 
     * @param {*} isolate 
     * @param {*} orbit 
     */
    constructor(isolate, orbit) {
        this.#isolate = isolate;
        this.#orbit = orbit;
        this.#isolate.addEventListener('frame-begin', this.#on_frame_begin);
    }

    /**
     * 
     * 移动看向的目标
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    moveTargetTo(x, y, z) {
        if (isObject(x)) {
            y = x.y;
            z = x.z;
            x = x.x;
        }

        this.cancle();

        this.#orbit.getTarget(this.#vec3_0);
        const coords = {
            x : this.#vec3_0.x,
            y : this.#vec3_0.y,
            z : this.#vec3_0.z,
        };
        this.#tween = new TWEEN.Tween(coords, false)
                               .to({x, y, z}, TWEEN_EASING_TIME)
                               .easing(TWEEN.Easing.Quadratic.InOut)
                               .onUpdate(() => {
                                    this.#orbit.setTarget(coords.x, coords.y, coords.z);
                                })
                               .onComplete(() => {
                                    this.#tween.stop();
                                    this.#tween = undefined
                                })
                               .start();
        this.#isolate.requestAnimationFrame();
    }

    /**
     * 
     * 扭转球形镜头
     * 
     * @param {Number} a  x 轴逆时针，角度
     * @param {Number} b  z 轴顺时针，角度
     */
    RotateTo(a, b) {
        this.cancle();

        // 当前的数值
        const spherical_camera = this.#orbit.getSphericalCamera();
        let   s0 = Math.mod(spherical_camera.a, Math.PI * 2, 1000);
        let   s1 = Math.mod(spherical_camera.b, Math.PI * 2, 1000);
        if (s0 < 0) s0 += Math.PI * 2;
        if (s1 < 0) s1 += Math.PI * 2;
        const coords = {
             a : s0, 
             b : s1, 
        };

        // 目标数值
        a = Math.mod(Math.D2A_(a), Math.PI * 2, 1000);
        b = Math.mod(Math.D2A_(b), Math.PI * 2, 1000);
        if (a < 0) a += Math.PI * 2;
        if (b < 0) b += Math.PI * 2;

        this.#tween = new TWEEN.Tween(coords, false)
                               .to({ a, b, }, TWEEN_EASING_TIME)
                               .easing(TWEEN.Easing.Quadratic.InOut)
                               .onUpdate(() => {
                                    this.#orbit.setSphericalCamera(coords.a, coords.b);
                                })
                               .onComplete(() => {
                                    this.#tween.stop();
                                    this.#tween = undefined
                                })
                               .start();
        this.#isolate.requestAnimationFrame();
    }

    /**
     * 
     * 看向指定的元素
     * 
     * @param {*} object 
     */
    lookAtObject(object) {
        if (object instanceof XThree.Object3D) {
            this.moveTargetTo(object.getBasePoint(true));
        }
    }   

    /**
     * 看向X轴正方向
     */
    lookAtAxisX_P() { 
        this.RotateTo(180, 90); 
    }

    /**
     * 看向X轴负数方向
     */
    lookAtAxisX_N() { 
        this.RotateTo(0  , 90); 
    }

    /**
     * 看向Y轴正方向
     */
    lookAtAxisY_P() { 
        this.RotateTo(-90, 90); 
    }

    /**
     * 看向Y轴负方向
     */
    lookAtAxisY_N() { 
        this.RotateTo(90 , 90); 
    }

    /**
     * 看向Z轴正方向
     */
    lookAtAxisZ_P() { 
        this.RotateTo(0  , 180); 
    }

    /**
     * 看向Z轴负方向
     */
    lookAtAxisZ_N() { 
        this.RotateTo(-90, 0); 
    }

    /**
     * 看向XY平面，执行动画
     */
    lookAt_XY_Plane() {
        this.cancle();
        this.RotateTo(-90, 0);
    }

    /**
     * 
     * 看向XY平面，执行动画
     * 
     * @param {Number} distance 
     */
    lookAt_XY_Plane_Center(distance = undefined) {
        this.cancle();

        const spherical_camera = this.#orbit.getSphericalCamera();
        const a = Math.mod(Math.D2A_(-90), Math.PI * 2, 1000);
        const b = Math.mod(Math.D2A_(  0), Math.PI * 2, 1000);
        const d = this.#orbit.getDistance();
        this.#orbit.getTarget(this.#vec3_0);
        const coords = {
            x : this.#vec3_0.x,
            y : this.#vec3_0.y,
            z : this.#vec3_0.z,
            a : Math.mod(spherical_camera.a, Math.PI * 2, 1000),
            b : Math.mod(spherical_camera.b, Math.PI * 2, 1000),
            d : d,
        };
        distance = isNumber(distance)? distance: d;
        
        this.#tween = new TWEEN.Tween(coords, false)
                               .to({x: 0, y: 0, z:0, a, b, d:distance}, TWEEN_EASING_TIME)
                               .easing(TWEEN.Easing.Quadratic.InOut)
                               .onUpdate(() => {
                                    this.#orbit.setTarget(coords.x, coords.y, coords.z);
                                    this.#orbit.setDistance(coords.d);
                                    this.#orbit.setSphericalCamera(coords.a, coords.b);
                                })
                               .onComplete(() => {
                                    this.#tween.stop();
                                    this.#tween = undefined
                               })
                               .start();
        this.#isolate.requestAnimationFrame();
    }

    /**
     * 
     * 转到方位角
     * 
     * @param {*} orientation 
     */
    toOrientation(orientation) {
        if (!(orientation instanceof Orientation)) {
            return;
        }
        this.cancle();
        this.#orbit.backupOrientation(this.#orientation);

        // 调整
        const ao = orientation.clone();
        ao.spherical_camera_a = Math.mod(ao.spherical_camera_a, Math.PI * 2, 1000);
        ao.spherical_camera_b = Math.mod(ao.spherical_camera_b, Math.PI * 2, 1000);

        // 执行动画
        this.#tween = new TWEEN.Tween(this.#orientation, false)
                               .to(ao, TWEEN_EASING_TIME)
                               .easing(TWEEN.Easing.Quadratic.InOut)
                               .onUpdate(() => {
                                    this.#orbit.setOrientation(this.#orientation);
                                })
                               .onComplete(() => {
                                    this.#tween.stop();
                                    this.#tween = undefined
                                })
                               .start();
        this.#isolate.requestAnimationFrame();
    }

    /**
     * 取消当前的操作
     */
    cancle() {
        if (this.#tween) {
            this.#tween.stop();
            this.#tween = undefined
        }
    }

    /**
     * 
     * @param {*} event 
     */
    #onFrameBegin(event) {
        if (this.#tween) {
            this.#tween.update(event.timestamp);
            this.#isolate.requestAnimationFrame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.cancle();
        this.#isolate.removeEventListener('frame-begin', this.#on_frame_begin);
    }
}
