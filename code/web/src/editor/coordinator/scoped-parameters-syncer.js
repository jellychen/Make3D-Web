/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import ScopedParameters from '@core/houdini/scoped-parameters'

/**
 * 临时
 */
const raycaster = new XThree.Raycaster();

/**
 * 临时
 */
const _vec2_0 = new XThree.Vector2();
const _vec2_1 = new XThree.Vector2();
const _mat4_0 = new XThree.Matrix4();
const _mat4_1 = new XThree.Matrix4();
const _mat4_2 = new XThree.Matrix4();
const _mat4_3 = new XThree.Matrix4();

/**
 * 用来同步
 */
export default class ScopedParametersSyncer {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 实时渲染器
     */
    #cinderella;
    #cinderella_personal_cameraman;

    /**
     * 当前的相机
     */
    #camera;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        this.#coordinator = coordinator;
        this.#cinderella = this.#coordinator.cinderella;
        this.#cinderella_personal_cameraman = this.#cinderella.getPersonalCameraman();
    }

    /**
     * 
     * 同步 Viewport
     * 
     * @returns 
     */
    syncViewportSize() {
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        const p = this.#cinderella.pixel_ratio;
        ScopedParameters.setViewportSize(w, h, p);
        return this;
    }

    /**
     * 
     * 同步相机开始
     * 
     * @returns 
     */
    syncCameraBegin() {
        this.#camera = this.#cinderella_personal_cameraman.camera;
        return this;
    }
    
    /**
     * 
     * 同步相机的后面截面
     * 
     * @returns 
     */
    syncCameraFrustumNearAndFar() {
        const n = this.#camera.near;
        const f = this.#camera.far;
        ScopedParameters.setFrustumNearAndFar(n, f);
        return this;
    }

    /**
     * 
     * 同步相机的位置
     * 
     * @returns 
     */
    syncCameraLocation() {
        ScopedParameters.setCameraLocation(this.#camera.position);
        return this;
    }

    /**
     * 
     * 同步相机的看向目标
     * 
     * @returns 
     */
    syncCameraLookatTarget() {
        ScopedParameters.setCameraLookatTarget(
            this.#cinderella_personal_cameraman.getCameraTarget());
        return this;
    }

    /**
     * 
     * 同步投影矩阵
     * 
     * @param {*} update 
     * @returns 
     */
    syncCameraProjection(update = false) {
        if (update) {
            this.#camera.updateProjectionMatrix();
        }
        ScopedParameters.setP(this.#camera.projectionMatrix);
        return this;
    }

    /**
     * 
     * 同步视图矩阵
     * 
     * @param {*} update 
     * @returns 
     */
    syncCameraView(update = false) {
        if (update) {
            this.#camera.updateMatrixWorld();
        }
        ScopedParameters.setV(this.#camera.matrixWorldInverse);
        return this;
    }

    /**
     * 
     * 更新VP矩阵
     * 
     * @param {*} update 
     * @returns 
     */
    syncCameraViewProjection(update = false) {
        this.syncCameraProjection(update);
        this.syncCameraView(update);
        const p = this.#camera.projectionMatrix;
        const v = this.#camera.matrixWorldInverse;
        _mat4_0.multiplyMatrices(p, v);
        ScopedParameters.setVP(_mat4_0);
        return this;
    }

    /**
     * 
     * UI坐标系下
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    syncCameraRay_UIC(x, y) {
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        _vec2_0.x = x / w * 2.0 - 1.0;
        _vec2_0.y = 1.0 - y / h * 2.0;
        raycaster.setFromCamera(_vec2_0, this.#camera);
        ScopedParameters.setRay(raycaster.ray);
        return this;
    }

    /**
     * 同步结束
     */
    syncCameraFinish() {
        this.#camera = undefined;
        return this;
    }
}
