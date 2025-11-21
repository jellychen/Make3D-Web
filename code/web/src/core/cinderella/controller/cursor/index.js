/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree     from '@xthree/basic';
import Constants  from './constants';
import Renderable from './renderable';

/**
 * 临时变量
 */
const _vec3_0     = new XThree.Vector3();
const _vec3_1     = new XThree.Vector3();
const _vec3_z     = new XThree.Vector3(0, 0, 1);
const _vec4       = new XThree.Vector4();
const _position   = new XThree.Vector3();
const _scale      = new XThree.Vector3();
const _quaternion = new XThree.Quaternion();

/**
 * 变换的组件
 */
export default class Cursor extends XThree.Group {
    /**
     * 请求重绘
     */
    #request_animation_frame;

    /**
     * orbit 组件
     */
    #orbit;
    #orbit_spherical_camera;

    /**
     * 网格和网格缩放
     */
    #mesh;
    #mesh_scale = 1.0;

    /**
     * 分辨率
     */
    #resolution_w = 0;
    #resolution_h = 0;

    /**
     * orbit 发生变化
     */
    #orbit_onchanged = () => this.#onOrbitChanged();

    /**
     * 
     * 构造函数
     * 
     * @param {*} orbit 
     * @param {Function} request_animation_frame 
     */
    constructor(orbit, request_animation_frame) {
        super();

        // 保存
        this.#request_animation_frame = request_animation_frame;

        // 配置网格
        this.#mesh                    = new Renderable();
        this.add(this.#mesh);

        // 监听orbit的状态变动
        this.#orbit                   = orbit;
        this.#orbit_spherical_camera  = this.#orbit.getSphericalCamera();
        this.#orbit.addEventListener("changed", this.#orbit_onchanged);
        
        // 更新
        this.#update();
    }

    /**
     * 
     * 设置位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition(x = 0, y = 0, z = 0) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.renderNextFrame();
    }

    /**
     * 
     * 大小发生变动的时候
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        if (this.#resolution_w === width && this.#resolution_h === height) {
            return;
        } else {
            this.#resolution_w = width;
            this.#resolution_h = height;
            this.#mesh.setResolution(width, height);
        }
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.visible) {
            return;
        }

        // 获取当前的Viewport
        renderer.getViewport(_vec4);

        // 透视相机
        if ("PerspectiveCamera" === camera.type) {
            _vec3_0.copy(this.#mesh.position).sub(camera.position);
            _vec3_1.copy(camera.target)      .sub(camera.position).normalize();
            const viewport_h  = _vec4.w;
            const fov         = camera.fov;
            const near        = camera.near;
            const distance    = _vec3_0.dot(_vec3_1);
            this.#mesh_scale  = 1.0;
            this.#mesh_scale *= distance / Constants.FLAUNT_CAMERA_DISTANCE;
            this.#mesh_scale *= Math.tan(Math.D2A_(fov) * 0.5) * near;
            this.#mesh_scale *= 1.0 / (Math.tan(Math.D2A_(Constants.FLAUNT_CAMERA_FOV) * 0.5) * Constants.FLAUNT_CAMERA_NEAR);
            this.#mesh_scale *= Constants.FLAUNT_CAMERA_VIEWPORT_HEIGHT / viewport_h;
        }

        // 正交相机
        else if ("OrthographicCamera" === camera.type) {
            const viewport_h = _vec4.w;
            const h          = camera.top - camera.bottom;
            this.#mesh_scale = h / viewport_h * Constants.FLAUNT_CAMERA_ORTHO_SCALE;
        }

        // 调整缩放
        this.#mesh.scale.set(this.#mesh_scale, this.#mesh_scale, this.#mesh_scale);

        // 执行渲染
        renderer.render(this, camera);
    }

    /**
     * 更新
     */
    #update() {
        const target = this.#orbit_spherical_camera.getTarget();
        this.#mesh.position.copy(target);
        const dir = this.#orbit_spherical_camera.getDirFaceToCamera();
        _quaternion.setFromUnitVectors(_vec3_z, dir);
        this.#mesh.quaternion.copy(_quaternion);
    }

    /**
     * orbit 
     */
    #onOrbitChanged() {
        this.#update();
    }

    /**
     * 再下一帧中进行渲染
     */
    renderNextFrame() {
        this.#request_animation_frame();
    }

    /**
     * 废弃
     */
    dispose() {
        this.#mesh.dispose(true, true);
    }
}
