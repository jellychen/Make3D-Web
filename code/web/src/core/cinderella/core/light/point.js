/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree    from '@xthree/basic';
import Constants from './constants';

/**
 * 点光源，默认不打开阴影投射
 */
export default class LightPoint extends XThree.PointLight {
    /**
     * 成员变量
     */
    #scene;

    /**
     * 获取
     */
    get angle() {
        return 0;
    }

    /**
     * 
     * 构造函数
     *  
     * @param {*} scene 
     */
    constructor(scene) {
        super();
        this.#scene     = scene;
        this.castShadow = true;
        this.resetShadowConf(false);
    }
    
    /**
     * 重置
     */
    resetShadowConf(render_next_frame = true) {
        this.shadow.camera.near    = Constants.DEFAULT_SHADOW_CAMERA_NEAR;
        this.shadow.camera.far     = Constants.DEFAULT_SHADOW_CAMERA_FAR;
        this.shadow.camera.right   = Constants.DEFAULT_SHADOW_CAMERA_RIGHT;
        this.shadow.camera.left    = Constants.DEFAULT_SHADOW_CAMERA_LEFT;
        this.shadow.camera.top	   = Constants.DEFAULT_SHADOW_CAMERA_TOP;
        this.shadow.camera.bottom  = Constants.DEFAULT_SHADOW_CAMERA_BOTTOM;
        this.shadow.mapSize.width  = Constants.DEFAULT_SHADOW_CAMERA_MAPSIZE_WIDTH;
        this.shadow.mapSize.height = Constants.DEFAULT_SHADOW_CAMERA_MAPSIZE_HEIGHT;
        this.shadow.radius         = Constants.DEFAULT_SHADOW_CAMERA_RADIUS;
        this.shadow.bias           = Constants.DEFAULT_SHADOW_CAMERA_BIAS_LIGHT_POINT;

        if (render_next_frame) {
            this.requestAnimationFrameIfNeed();
        }
    }

    /**
     * 
     * 获取类型
     * 
     * @returns 
     */
    getType() {
        return this.type;
    }

    /**
     * 
     * 克隆
     * 
     * @returns 
     */
    clone() {
        const object = new LightPoint(this.#scene);
        object.copy(this, false);
        return object;
    }

    /**
     * 
     * 设置开启辅助线
     * 
     * @param {boolean} enable 
     */
    setEnableHelper(enable) {
        return true;
    }

    /**
     * 
     * 如果存在helper 更新辅助
     * 
     * @returns 
     */
    updateHelperIfHas() {
        return true;
    }

    /**
     * 把位置更新到light里面
     */
    update() {
        ;
    }

    /**
     * 
     * 动态修改颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.color.setHex(color);
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置颜色的能量
     * 
     * @param {Number} value 
     */
    setIntensity(value) {
        this.intensity = value;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置光源影响的最大范围，为0的时候影响到无限远处
     * 
     * @param {Number} distance 
     */
    setDistance(distance) {
        this.distance = distance;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置能量，流明，会影响到 intensity
     * 
     * @param {Number} value 
     */
    setPower(value) {        
        this.power = value;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 打开光源投射
     * 
     * @param {Boolean} enable 
     */
    setEnableCastShadow(enable) {
        this.castShadow = enable;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 在场景中就执行次帧重绘
     */
    requestAnimationFrameIfNeed() {
        this.#scene.requestAnimationFrameIfNeed();
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
        this.setEnableHelper(false);
    }
}
