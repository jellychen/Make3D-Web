/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';
import Constants      from './constants';

/**
 * 临时变量
 */
const _vec3_0 = new XThree.Vector3(0, 0, 1);
const _vec3_1 = new XThree.Vector3(0, 0, 1);
const _vec4_0 = new XThree.Vector4();
const _vec4_1 = new XThree.Vector4();

/**
 * 模拟Blender的面侦测
 */
export default class PlaneDetector {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 标记是不是有效
     */
    #enable   = false;

    /**
     * 组
     */
    #group    = new XThree.Group();

    /**
     * 缩放
     */
    #scale    = 1.0;

    /**
     * 渲染元素
     */
    #mesh     = new XThree.Mesh();
    #material = new XThreeMaterial.CirclePattern();

    /**
     * 记录当前的位置信息
     */
    #position = new XThree.Vector3(0, 0, 0);
    #z_dir    = new XThree.Vector3(0, 0, 1);

    /**
     * 获取
     */
    get position() {
        return this.#position;
    }

    /**
     * 获取
     */
    get z_dir() {
        return this.#z_dir;
    }

    /**
     * 判断可用性
     */
    get enable() {
        return this.#enable;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {Function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        this.#request_animation_frame = request_animation_frame;

        // 构建渲染的网格
        const v = new Float32Array(12);
        v[ 0]   = -1.0;
        v[ 1]   = +1.0;
        v[ 2]   = +0.0;
        v[ 3]   = -1.0;
        v[ 4]   = -1.0;
        v[ 5]   = +0.0;
        v[ 6]   = +1.0;
        v[ 7]   = -1.0;
        v[ 8]   = +0.0;
        v[ 9]   = +1.0;
        v[10]   = +1.0;
        v[11]   = +0.0;

        const u = new Float32Array(8);
        u[0]    = 0;
        u[1]    = 1;
        u[2]    = 0;
        u[3]    = 0;
        u[4]    = 1;
        u[5]    = 0;
        u[6]    = 1;
        u[7]    = 1;

        const i = new Uint16Array(6);
        i[0]    = 0;
        i[1]    = 1;
        i[2]    = 2;
        i[3]    = 0;
        i[4]    = 2;
        i[5]    = 3;

        const geo = new XThree.BufferGeometry();
        geo.setAttribute('position', new XThree.BufferAttribute(v, 3));
        geo.setAttribute('uv', new XThree.BufferAttribute(u, 2));
        geo.setIndex(new XThree.BufferAttribute(i, 1));
        this.#material.setScale(32);
        this.#mesh.geometry = geo;
        this.#mesh.material = this.#material;

        // 构建
        this.#group.add(this.#mesh);

        // 初始化状态
        this.setEnable(true);
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
        } else {
            this.#enable = true === enable;
            this.#requestAnimationFrame();
        }
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#material.setColor(color);
    }

    /**
     * 
     * 设置位置信息
     * 
     * @param {XThree.Vector3} position  位置
     * @param {XThree.Vector3} z_dir     朝向
     */
    setPositionInfo(position, z_dir) {
        _vec3_0.copy(z_dir);
        _vec3_0.normalize();
        _vec3_1.set(0, 0, 1);
        this.#position.copy(position);
        this.#z_dir   .copy(_vec3_0);

        // 调整
        this.#group.matrix.identity();
        this.#group.position.copy(position);
        this.#group.quaternion.setFromUnitVectors(_vec3_1, _vec3_0);

        // 执行
        this.#requestAnimationFrame();
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.#enable) {
            return;
        }

        // 获取当前的Viewport
        renderer.getViewport(_vec4_0);

        // 透视相机
        if ("PerspectiveCamera" === camera.type) {
            _vec3_0.copy(this.#mesh.position).sub(camera.position);
            _vec3_1.copy(camera.target)      .sub(camera.position).normalize();
            const viewport_h = _vec4_0.w;
            const fov        = camera.fov;
            const near       = camera.near;
            const distance   = _vec3_0.dot(_vec3_1);
            this.#scale      = Constants.FLAUNT_SCALE;
            this.#scale     *= distance / Constants.FLAUNT_CAMERA_DISTANCE;
            this.#scale     *= Math.tan(Math.D2A_(fov) * 0.5) * near;
            this.#scale     *= 1.0 / (Math.tan(Math.D2A_(Constants.FLAUNT_CAMERA_FOV) * 0.5) * Constants.FLAUNT_CAMERA_NEAR);
            this.#scale     *= Constants.FLAUNT_CAMERA_VIEWPORT_HEIGHT / viewport_h;
        }

        // 正交相机
        else if ("OrthographicCamera" === camera.type) {
            const viewport_h = _vec4_0.w;
            const h          = camera.top - camera.bottom;
            this.#scale      = h / viewport_h * Constants.FLAUNT_CAMERA_ORTHO_SCALE;
        }

        // 调整缩放
        this.#group.scale.set(this.#scale, this.#scale, this.#scale);

        // 记录
        this.#updateWorldToLocalMatrix();

        // 执行渲染
        renderer.render(this.#group, camera);
    }

    /**
     * 更新矩阵
     */
    #updateWorldToLocalMatrix() {
        this.#group.updateWorldMatrix(true, false);
    }

    /**
     * 请求一帧新的渲染
     */
    #requestAnimationFrame() {
        this.#request_animation_frame();
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#mesh) {
            this.#mesh.dispose(true, true);
            this.#mesh = undefined;
            this.#material = undefined;
        }
    }
}
