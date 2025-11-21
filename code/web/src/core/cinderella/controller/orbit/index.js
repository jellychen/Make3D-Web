/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import SphericalCamera       from '@common/math/spherical-camera';
import CameraStandController from './camera-stand-controller';
import Orientation           from './orientation';

/**
 * 默认值
 */
const DEFAULT_CAMERA_RADIUS              = 10 ; // 相机的半径
const DEFAULT_CAMERA_POLAR_COORDINATES_A = -75; // 默认的
const DEFAULT_CAMERA_POLAR_COORDINATES_B = +80; // 默认的
const DEFAULT_CAMERA_V_ANGLE             = 180; // 垂直最大角度
const DEFAULT_CAMERA_H_ANGLE             = 360; // 水平最大角度

/**
 * 临时变量
 */
const _vec3_0 = new XThree.Vector3();
const _vec3_1 = new XThree.Vector3();

/**
 * 鼠标控制
 */
export default class Orbit extends XThree.Object3D {
    /**
     * 核心
     */
    #isolate;

    /**
     * 标记是不是有效
     */
    #enable             = false;

    /**
     * 主动监听事件
     */
    #enable_event_owner = true;

    /**
     * 球形轨迹相机
     */
    #spherical_camera   = new SphericalCamera();

    /**
     * 操作的相机
     */
    #personal_cameraman;

    /**
     * 监听DOM的事件
     */
    #attached_interactive;

    /**
     * 监听的事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;

    /**
     * 鼠标按下的坐标
     */
    #pointer_down_offset_x;
    #pointer_down_offset_y;
    #pointer_down_camera_polar_coordinates_a;
    #pointer_down_camera_polar_coordinates_b;

    /**
     * 回调
     */
    #on_changed_callback;

    /**
     * 表示当前的组件是不是接管了
     */
    #is_take_over = false;

    /**
     * 机位控制器
     */
    #camera_stand_controller;

    /**
     * 
     * 构造函数
     * 
     * @param {*} isolate 
     * @param {*} interactive 
     * @param {*} personal_cameraman 
     * @param {boolean} enable_event_owner 
     */
    constructor(isolate, interactive, personal_cameraman, enable_event_owner = true) {
        super();
        this.#isolate              = isolate;
        this.#personal_cameraman   = personal_cameraman;
        this.#attached_interactive = interactive;
        this.#enable_event_owner   = enable_event_owner;

        // 监听事件
        this.#on_pointer_down   = event => this.#onPointerDown(event);
        this.#on_pointer_move   = event => this.#onPointerMove(event);
        this.#on_pointer_up     = event => this.#onPointerUp(event);
        this.#on_pointer_cancel = event => this.#onPointerCancel(event);

        // 设置初始值
        this.reset();
        this.setEnable(true);

        // 机位控制器
        this.#camera_stand_controller = new CameraStandController(isolate, this);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (enable === this.#enable) {
            return;
        }

        // 如果主动监听事件
        if (this.#enable_event_owner) {
            if (enable) {
                this.attach();
            } else {
                this.detach();
            }
        }
        
        this.#enable = true === enable;
    }

    /**
     * 添加对事件的监听
     */
    attach() {
        this.#attached_interactive.addEventListener('pointerdown',   this.#on_pointer_down);
    }

    /**
     * 取消对事件的监听
     */
    detach() {
        this.#attached_interactive.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#attached_interactive.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#attached_interactive.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 获取机位控制
     * 
     * @returns 
     */
    getCameraStandController() {
        return this.#camera_stand_controller;
    }

    /**
     * 
     * 相机复原到原先的位置
     * 
     * @param {*} target 
     * @param {*} radius 
     */
    reset(target = false, radius = false) {
        if (target) {
            this.#spherical_camera.setTarget(0, 0, 0);
        }

        if (radius) {
            this.#spherical_camera.setRadius(DEFAULT_CAMERA_RADIUS);
        }

        this.#spherical_camera.a = Math.D2A_(DEFAULT_CAMERA_POLAR_COORDINATES_A);
        this.#spherical_camera.b = Math.D2A_(DEFAULT_CAMERA_POLAR_COORDINATES_B);
        this.setInfoToCameraman();
    }

    /**
     * 
     * 角度值
     * 
     * @param {*} a 
     * @param {*} b 
     */
    animationRotateTo(a, b) {
        this.#camera_stand_controller.RotateTo(a, b);
    }

    /**
     * 动画转动
     */
    animationRotateToDefault() {
        this.#camera_stand_controller.RotateTo(DEFAULT_CAMERA_POLAR_COORDINATES_A, DEFAULT_CAMERA_POLAR_COORDINATES_B);
    }

    /**
     * 
     * 位置信息赋予元素
     * 
     * @param {*} object 
     */
    setInfoToObject(object) {
        const up       = this.#spherical_camera.getUp();
        const position = this.#spherical_camera.getPosition();
        const target   = this.#spherical_camera.getTarget();
        object.position.set(position.x, position.y, position.z);
        object.up.set(up.x, up.y, up.z);
        object.lookAt(target.x, target.y, target.z);
    }

    /**
     * 
     * 位置信息赋予Cameraman
     * 
     * @param {*} cameraman 
     */
    setInfoToCameraman(cameraman) {
        cameraman      = cameraman || this.#personal_cameraman;
        const up       = this.#spherical_camera.getUp();
        const position = this.#spherical_camera.getPosition();
        const target   = this.#spherical_camera.getTarget();
        cameraman.setCameraPosition(position.x, position.y, position.z);
        cameraman.setCameraUp(up.x, up.y, up.z);
        cameraman.setCameraTarget(target.x, target.y, target.z);
        cameraman.updateCamera();
    }

    /**
     * 信息更新到 this.#personal_cameraman;
     */
    update() {
        this.setInfoToCameraman();
    }

    /**
     * 
     * 获取相机的位置
     * 
     * @param {*} vec3 
     */
    getPosition(vec3) {
        vec3.copy(this.#spherical_camera.getPosition());
    }

    /**
     * 
     * 获取看向的目标
     * 
     * @param {*} vec3 
     */
    getTarget(vec3) {
        vec3.copy(this.#spherical_camera.getTarget());
    }

    /**
     * 
     * 获取头向量
     * 
     * @param {*} vec3 
     */
    getUp(vec3) {
        vec3.copy(this.#spherical_camera.getUp());
    }

    /**
     * 
     * 设置看向的目标点
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setTarget(x, y, z) {
        if (this.#spherical_camera.setTarget(x, y, z)) {
            this.#onDataChanged();
            this.setInfoToCameraman();
            this.#personal_cameraman.requestAnimationFrame();
        }
    }

    /**
     * 
     * 偏移看向的目标点
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    offsetTarget(x, y, z) {
        if (this.#spherical_camera.offsetTarget(x, y, z)) {
            this.#onDataChanged();
            this.setInfoToCameraman();
            this.#personal_cameraman.requestAnimationFrame();
        }
    }

    /**
     * 
     * 获取相机距离target的距离
     * 
     * @returns 
     */
    getDistance() {
        return this.#spherical_camera.radius;
    }

    /**
     * 
     * 设置相机距离target的距离
     * 
     * @param {Number} distance 
     */
    setDistance(distance) {
        if (this.#spherical_camera.setRadius(distance)) {
            this.#onDataChanged();
            this.setInfoToCameraman();
            this.#personal_cameraman.requestAnimationFrame();
        }
    }

    /**
     * 
     * 获取
     * 
     * @returns 
     */
    getSphericalCamera() {
        return this.#spherical_camera;
    }

    /**
     * 
     * 获取球形相机的半径
     * 
     * @returns 
     */
    getSphericalCameraRadius() {
        return this.#spherical_camera.radius;
    }

    /**
     * 
     * 调整球形相机
     * 
     * @param {number} a 
     * @param {number} b 
     */
    setSphericalCamera(a, b) {
        // 防止过度
        a = Math.mod(a, Math.PI * 2, 1000);
        b = Math.mod(b, Math.PI * 2, 1000);

        // 调整
        if (this.#spherical_camera.a != a || this.#spherical_camera.b != b) {
            this.#spherical_camera.a = a;
            this.#spherical_camera.b = b;
            this.#onDataChanged();
        }
    }

    /**
     * 
     * 获取经过目标点的面，法线是视向方向
     * 
     * @param {XThree.Plane} plane 
     */
    getTargetPlane(plane) {
        if (!plane || !(plane instanceof XThree.Plane)) {
            return;
        } else {
            this.#spherical_camera.updatePlane();
            plane.copy(this.#spherical_camera.plane);
        }
    }

    /**
     * 
     * 备份方位信息
     * 
     * @param {*} orientation 
     * @returns 
     */
    backupOrientation(orientation = undefined) {
        if (!(orientation instanceof Orientation)) {
            orientation = new Orientation();
        }

        const info = orientation;
        info.distance = this.#spherical_camera.radius;
        info.target_x = this.#spherical_camera.getTarget().x;
        info.target_y = this.#spherical_camera.getTarget().y;
        info.target_z = this.#spherical_camera.getTarget().z;
        info.spherical_camera_a = this.#spherical_camera.a;
        info.spherical_camera_b = this.#spherical_camera.b;
        return info;
    }

    /**
     * 
     * 设置方位
     * 
     * @param {*} orientation 
     * @returns 
     */
    setOrientation(orientation) {
        if (!(orientation instanceof Orientation)) {
            return;
        }

        const info = orientation;
        this.setDistance(info.distance);
        this.setSphericalCamera(info.spherical_camera_a, info.spherical_camera_b);
        this.setTarget(info.target_x, info.target_y, info.target_z);
        return this;
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        if (!this.#enable) {
            return false;
        }

        // 如果存在动画就关闭
        this.#camera_stand_controller.cancle();

        // 如果按下了Alt或者Ctrl或者使用鼠标右键
        if (!event.altKey && !event.ctrlKey && event.buttons != 2) {
            return false;
        }

        this.#is_take_over = true;
        this.#attached_interactive.setPointerCapture(event.pointerId);
        this.#attached_interactive.addEventListener('pointermove', this.#on_pointer_move);
        this.#attached_interactive.addEventListener('pointerup', this.#on_pointer_up);
        this.#attached_interactive.addEventListener('pointercancel', this.#on_pointer_cancel);
        this.#pointer_down_offset_x = event.x;
        this.#pointer_down_offset_y = event.y;
        this.#pointer_down_camera_polar_coordinates_a = this.#spherical_camera.a;
        this.#pointer_down_camera_polar_coordinates_b = this.#spherical_camera.b;

        return true;
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (!this.#enable) {
            return;
        }

        if (!this.#is_take_over) {
            return;
        }
        
        const w = this.#attached_interactive.offsetWidth;
        const h = this.#attached_interactive.offsetHeight;
        const x = event.x;
        const y = event.y;
        const offset_a = Math.D2A_((this.#pointer_down_offset_x - x) / w * DEFAULT_CAMERA_H_ANGLE);
        const offset_b = Math.D2A_((this.#pointer_down_offset_y - y) / h * DEFAULT_CAMERA_V_ANGLE);
        this.#spherical_camera.a = offset_a + this.#pointer_down_camera_polar_coordinates_a;
        this.#spherical_camera.b = offset_b + this.#pointer_down_camera_polar_coordinates_b;
        this.#spherical_camera.a = Math.mod(this.#spherical_camera.a, Math.PI * 2, 1000);
        this.#spherical_camera.b = Math.mod(this.#spherical_camera.b, Math.PI * 2, 1000);
        
        this.#onDataChanged();
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        if (!this.#enable) {
            return;
        }

        if (!this.#is_take_over) {
            return;
        }

        this.#is_take_over = false;
        this.#attached_interactive.releasePointerCapture(event.pointerId);
        this.#attached_interactive.removeEventListener('pointermove', this.#on_pointer_move);
        this.#attached_interactive.removeEventListener('pointerup', this.#on_pointer_up);
        this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#onPointerUp(event);
    }

    /**
     * 
     * 外部的事件分发，返回值表示成功响应事件，期待后续事件
     * 
     * @param {*} event 
     * @returns Boolean
     */
    dispathPointerDown(event) {
        if (this.#enable) {
            return this.#onPointerDown(event);
        }
        return false;
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerMove(event) {
        if (this.#enable) {
            this.#onPointerMove(event);
        }
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerUp(event) {
        if (this.#enable) {
            this.#onPointerUp(event);
        }
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerCancel(event) {
        if (this.#enable) {
            this.#onPointerCancel(event);
        }
    }

    /**
     * 设置发生变化后的回调
     * 
     * @param {function} callback
     */
    set onchanged(callback) {
        this.#on_changed_callback = callback;
    }

    /**
     * 收到数据变动
     */
    #onDataChanged() {
        // 调整摄像机
        this.setInfoToCameraman();
        this.#isolate.dispatchEvent('view-changed', {
            a: this.#spherical_camera.a,
            b: this.#spherical_camera.b,
        });

        // 发送事件
        this.dispatchEvent({type: 'changed'});
        if (this.#on_changed_callback) {
            this.#on_changed_callback();
        }

        // 请求重绘
        this.#personal_cameraman.requestAnimationFrame();
    }

    /**
     * 释放内部的状态
     */
    dispose() {
        this.detach();
    }
}
