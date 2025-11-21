/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree        from '@xthree/basic';
import Vec2          from '@common/math/vec2';
import Vec3          from '@common/math/vec3';
import UniformCamera from './uniform-camera';

/**
 * 编辑摄像师, 永远看向世界坐标的中心
 * 
 * notice: 需要修改内部相机的位置
 */
export default class PersonalCameraman {
    /**
     * 临时变量
     */
    static _raycaster = new XThree.Raycaster();
    static _point     = new XThree.Vector2();
    static _normal    = new XThree.Vector3();

    /**
     * 核心
     */
    #isolate;

    /**
     * 场景
     */
    #scene;

    /**
     * none/ortho/perspective
     */
    #camera_type    = 'none';

    /**
     * 用来记录
     */
    #position       = new Vec3(0, 0, 0);
    #up             = new Vec3(1, 0, 0);
    #camera_p       = new XThree.PerspectiveCamera();
    #camera_o       = new XThree.OrthographicCamera();
    #camera;
    #camera_uniform = new UniformCamera();

    /**
     * 用来记录相机的更改
     */
    #version = 0;

    /**
     * 获取相机的类型
     */
    get cameraType() {
        return this.#camera_type;
    }

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
     * @param {*} isolate 
     */
    constructor(isolate) {
        this.#isolate        = isolate;
        this.#scene          = isolate.getScene();
        this.#camera_type    = 'perspective';
        this.#camera         = new XThree.PerspectiveCamera();
        this.#camera.version = this.#version++;
    }

    /**
     * 标记相机发生变化
     */
    markUpdate() {
        this.#camera.version = this.#version++;
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
        this.#camera_uniform.setPosition(x, y, z);
        this.#position.x     = x;
        this.#position.y     = y;
        this.#position.z     = z;
        this.#camera.version = this.#version++;
    }

    /**
     * 
     * 获取相机位置
     * 
     * @returns 
     */
    getCameraPosition() {
        return this.#position;
    }

    /**
     * 计算相机位置和Target的距离
     */
    clacDistance() {
        const target = this.getCameraTarget();
        const x0     = target.x;
        const y0     = target.y;
        const z0     = target.z;
        const x1     = this.#position.x;
        const y1     = this.#position.y;
        const z1     = this.#position.z;
        return Math.hypot(x0 - x1, y0 - y1, z0 - z1);
    }

    /**
     * 
     * 计算给定点到相机位置的距离
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    calcDistanceToPosition(x, y, z) {
        const x0 = this.#position.x;
        const y0 = this.#position.y;
        const z0 = this.#position.z;
        return Math.hypot(x0 - x, y0 - y, z0 - z);
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
        this.#up.x           = x;
        this.#up.y           = y;
        this.#up.z           = z;
        this.#camera.version = this.#version++;
    }

    /**
     * 
     * 获取相机的头向量
     * 
     * @returns 
     */
    getCameraUp() {
        return this.#up;
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
        this.#camera_uniform.setTarget(x, y, z);
        this.#camera.lookAt(x, y, z);
        this.#camera.version = this.#version++;
    }

    /**
     * 
     * 获取看向的目标
     * 
     * @returns 
     */
    getCameraTarget() {
        return this.#camera_uniform.getTarget();
    }

    /**
     * 
     * 设置FOV
     * 
     * @param {Number} fov 
     */
    setFov(fov) {
        this.#camera_uniform.setFov(fov);
        this.#camera.version = this.#version++;
    }

    /**
     * 
     * 设置前后面
     * 
     * @param {Number} near 
     * @param {Number} far 
     */
    setNearFar(near, far) {
        this.#camera_uniform.setNearFar(near, far);
        this.#camera.version = this.#version++;
    }

    /**
     * 
     * 尺寸发生变化
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(width, height) {
        this.#camera_uniform.setAspect(width / height);
        this.updateCamera();
    }

    /**
     * 更新相机
     */
    updateCamera() {
        if (this.#camera) {
            if ('perspective'    == this.#camera_type) {
                this.#camera_uniform.setInfoToPerspective(this.#camera);
            } else if ('ortho'   == this.#camera_type) {
                this.#camera_uniform.setInfoToOrtho(this.#camera);
            }
            this.#camera.version = this.#version++;
        }
    }

    /**
     * 切换到正交投影
     */
    switchToOrtho() {
        if ('ortho'          != this.#camera_type) {
            let current       = this.#camera;
            this.#camera_type = 'ortho';
            this.#camera      = this.#camera_o;
            this.#camera.quaternion.copy(current.quaternion);
            this.updateCamera();
            this.requestAnimationFrame();
        }
    }

    /**
     * 切换到透视投影
     */
    switchToPerspective() {
        if ('perspective'    != this.#camera_type) {
            const current     = this.#camera;
            this.#camera_type = 'perspective';
            this.#camera      = this.#camera_p;
            this.#camera.quaternion.copy(current.quaternion);
            this.updateCamera();
            this.requestAnimationFrame();
        }
    }

    /**
     * 
     * 切换
     * 
     * @param {string} type 
     */
    switch(type) {
        if ('ortho'              === type) {
            this.switchToOrtho();
        } else if ('perspective' === type) {
            this.switchToPerspective();
        }
    }

    /**
     * 
     * 获取射线拾取
     * 
     * @param {Number} screen_ndc_x 
     * @param {Number} screen_ndc_y 
     */
    getRaycaster(screen_ndc_x, screen_ndc_y) {
        const p = PersonalCameraman._point;
        const r = PersonalCameraman._raycaster;
        p.x     = screen_ndc_x;
        p.y     = screen_ndc_y;
        r.setFromCamera(p, this.#camera);
        return r;
    }

    /**
     * 获取投影面，透视投影的就是前平面
     */
    getProjectingPlaneSize() {
        if ('ortho' == this.#camera_type) {
            const vec2   = new Vec2();
            vec2.x       = this.#camera.right - this.#camera.left;
            vec2.y       = this.#camera.top - this.#camera.bottom;
            return vec2;
        } else if ('perspective' == this.#camera_type) {
            const aspect = this.#camera.aspect;
            const fov    = this.#camera.fov;
            const near   = this.#camera.near;
            const half_h = Math.tan(Math.D2A_(fov / 2.0)) * near;
            const half_w = aspect * half_h;
            const vec2   = new Vec2();
            vec2.x       = half_w * 2.0;
            vec2.y       = half_h * 2.0;
            return vec2;
        }
    }

    /**
     * 由于数据变动，请求一帧新的渲染
     */
    requestAnimationFrame() {
        this.#isolate.requestAnimationFrame();
    }
}
