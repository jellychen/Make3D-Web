/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import Collaborator from './collaborator';

/**
 * 整个场景
 */
export default class Scene extends XThree.Scene {
    /**
     * 用来触发下一帧重绘的接口
     */
    request_animation_frame = () => {};

    /**
     * 渲染接口
     */
    renderer;

    /**
     * 用来存储
     */
    collaborator;

    /**
     * 主动触发重绘
     */
    auto_request_animation_frame = true;

    /**
     * 是不是在渲染过程中
     */
    is_rendering = false;

    /**
     * 
     * 当前渲染的尺寸
     * 
     * 只有在渲染过程中才有效
     * 
     */
    #pixel_ratio = 1.0;
    #w           = 0;
    #h           = 0;

    /**
     * 默认的环境
     */
    default_env_texture;

    /**
     * 禁止阴影
     */
    forbidden_shadow = false;
    
    /**
     * 
     * 获取
     * 
     * 只有在渲染过程中有效
     * 
     */
    get pixel_ratio() {
        return this.#pixel_ratio;
    }

    /**
     * 
     * 获取
     * 
     * 只有在渲染过程中有效
     * 
     */
    get w() {
        return this.#w;
    }

    /**
     * 
     * 获取
     * 
     * 只有在渲染过程中有效
     * 
     */
    get h() {
        return this.#h;
    }

    /**
     * 获取
     */
    get environment_intensity() {
        return this.environmentIntensity;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} request_animation_frame 
     * @param {*} renderer 
     */
    constructor(request_animation_frame, renderer) {
        super();
        this.forbidden_shadow        = false;
        this.request_animation_frame = request_animation_frame;
        this.renderer                = renderer;
        this.collaborator            = new Collaborator(request_animation_frame);
        this.environmentRotation     = new XThree.Euler();
        this.environmentRotation.x   = Math.PI / 2;
        this.backgroundRotation      = this.environmentRotation;
        this.environmentIntensity    = 0.8;

        //
        // 初始化的情况下使用默认的IBL
        //
        this.setDefaultEnvironment();
    }

    /**
     * 
     * 判断会不会主动触发重绘
     * 
     * @returns 
     */
    getAutoRequestAnimationFrame() {
        return this.auto_request_animation_frame;
    }

    /**
     * 
     * 开启或者关闭自动触发重绘
     * 
     * @param {boolean} enable 
     */
    setEnableAutoRequestAnimationFrame(enable) {
        this.auto_request_animation_frame = true === enable;
    }

    /**
     * 
     * 协助者
     * 
     * @returns 
     */
    getCollaborator() {
        return this.collaborator;
    }

    /**
     * 
     * 是否开启阴影
     * 
     * @param {*} enable 
     */
    setEnableShadow(enable) {
        enable = true == enable;
        this.forbidden_shadow = !enable;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置场景雾
     * 
     * @param {*} color 
     * @param {Number} density 
     */
    setFog(color, density) {
        this.fog = new XThree.FogExp2(color, density);
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 移除场景雾
     */
    removeFog() {
        this.fog = undefined;
        this.requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 渲染开始
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    beforeRender(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w           = width;
        this.#h           = height;
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        this.is_rendering = true;
        renderer.render(this, camera);
        this.is_rendering = false;
    }

    /**
     * 渲染结束
     */
    afterRender() {
        this.#pixel_ratio = 1;
        this.#w           = 0;
        this.#h           = 0;
    }

    /**
     * 
     * 在下一帧执行渲染
     * 
     * @returns 
     */
    requestAnimationFrameIfNeed() {
        if (this.auto_request_animation_frame && this.request_animation_frame) {
            this.request_animation_frame();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}
