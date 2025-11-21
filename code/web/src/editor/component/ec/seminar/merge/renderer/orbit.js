/* eslint-disable no-unused-vars */

import SphericalCamera from '@common/math/spherical-camera';
import XThree          from '@xthree/basic';

/**
 * 默认值
 */
const DEFAULT_CAMERA_RADIUS              = 10 ; // 相机的半径
const DEFAULT_CAMERA_POLAR_COORDINATES_A = -75; // 默认的
const DEFAULT_CAMERA_POLAR_COORDINATES_B = +30; // 默认的
const DEFAULT_CAMERA_V_ANGLE             = 180; // 垂直最大角度
const DEFAULT_CAMERA_H_ANGLE             = 360; // 水平最大角度

/**
 * 渲染器
 */
export default class Orbit {
    /**
     * 元素
     */
    #dom_element;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 相机
     */
    #camera   = new XThree.PerspectiveCamera();
    #position = new XThree.Vector3(0, 0, 0);
    #up       = new XThree.Vector3(1, 0, 0);

    /**
     * 球形相机
     */
    #camera_spherical = new SphericalCamera();

    /**
     * 事件回调
     */
    onchanged;

    /**
     * 事件
     */
    #on_pointer_down   = event => this.#onPointerDown(event);
    #on_pointer_move   = event => this.#onPointerMove(event);
    #on_pointer_up     = event => this.#onPointerUp(event);
    #on_pointer_cancel = event => this.#onPointerCancel(event);

    /**
     * 记录一些数据
     */
    #pointer_down_offset_x;
    #pointer_down_offset_y;
    #pointer_down_camera_polar_coordinates_a;
    #pointer_down_camera_polar_coordinates_b;

    /**
     * 获取相机
     */
    get camera() {
        return this.#camera;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} dom_element 
     * @param {*} renderer 
     */
    constructor(dom_element, renderer) {
        this.#dom_element = dom_element;
        this.#renderer = renderer;
        this.#dom_element.addEventListener('pointerdown', this.#on_pointer_down);
        this.#camera_spherical.radius = DEFAULT_CAMERA_RADIUS;
        this.#camera_spherical.a = DEFAULT_CAMERA_POLAR_COORDINATES_A / 180 * Math.PI;
        this.#camera_spherical.b = DEFAULT_CAMERA_POLAR_COORDINATES_B / 180 * Math.PI;
    }

    /**
     * 放大
     */
    zoomUp() {
        this.#camera_spherical.radius -= 0.5;
        if (this.#camera_spherical.radius < 1) {
            this.#camera_spherical.radius = 1;
        }
        this.#renderer.render();
    }

    /**
     * 缩小
     */
    zoomDown() {
        this.#camera_spherical.radius += 0.5;
        if (this.#camera_spherical.radius > 30) {
            this.#camera_spherical.radius = 30;
        }
        this.#renderer.render();
    }

    /**
     * 
     * 设置相机的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setCameraPosition(x, y, z) {
        this.#camera.position.set(x, y, z);
        this.#position.x = x;
        this.#position.y = y;
        this.#position.z = z;
    }

    /**
     * 
     * 设置相机的头向量
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setCameraUp(x, y, z) {
        this.#camera.up.set(x, y, z);
        this.#up.x = x;
        this.#up.y = y;
        this.#up.z = z;
    }

    /**
     * 
     * 设置看向的目标
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setCameraTarget(x, y, z) {
        this.#camera.lookAt(x, y, z);
    }

    /**
     * 
     * viewport变换
     * 
     * @param {*} width 
     * @param {*} height 
     */
    resize(width, height) {
        this.#camera.aspect = width / height;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#dom_element.setPointerCapture(event.pointerId);
        this.#dom_element.addEventListener('pointermove'  , this.#on_pointer_move);
        this.#dom_element.addEventListener('pointerup'    , this.#on_pointer_up);
        this.#dom_element.addEventListener('pointercancel', this.#on_pointer_cancel);
        this.#pointer_down_offset_x = event.x;
        this.#pointer_down_offset_y = event.y;
        this.#pointer_down_camera_polar_coordinates_a = this.#camera_spherical.a;
        this.#pointer_down_camera_polar_coordinates_b = this.#camera_spherical.b;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        const w = this.#dom_element.offsetWidth;
        const h = this.#dom_element.offsetHeight;
        const x = event.x;
        const y = event.y;
        const offset_a = Math.D2A_((this.#pointer_down_offset_x - x) / w * DEFAULT_CAMERA_H_ANGLE);
        const offset_b = Math.D2A_((this.#pointer_down_offset_y - y) / h * DEFAULT_CAMERA_V_ANGLE);
        this.#camera_spherical.a = offset_a + this.#pointer_down_camera_polar_coordinates_a;
        this.#camera_spherical.b = offset_b + this.#pointer_down_camera_polar_coordinates_b;
        this.#camera_spherical.a = Math.mod(this.#camera_spherical.a, Math.PI * 2, 1000);
        this.#camera_spherical.b = Math.mod(this.#camera_spherical.b, Math.PI * 2, 1000);

        this.#renderer.render();
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#dom_element.releasePointerCapture(event.pointerId);
        this.#dom_element.removeEventListener('pointermove', this.#on_pointer_move);
        this.#dom_element.removeEventListener('pointerup', this.#on_pointer_up);
        this.#dom_element.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 更新
     */
    update() {
        const up       = this.#camera_spherical.getUp();
        const position = this.#camera_spherical.getPosition();
        const target   = this.#camera_spherical.getTarget();
        this.setCameraPosition(position.x, position.y, position.z);
        this.setCameraUp(up.x, up.y, up.z);
        this.setCameraTarget(target.x, target.y, target.z);
        this.#camera.fov = 50;
        this.#camera.updateProjectionMatrix();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#dom_element.removeEventListener('pointerdown', this.#on_pointer_down);
    }
}
