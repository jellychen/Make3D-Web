/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import XThree      from '@xthree/basic';
import Orbit       from './orbit';

/**
 * 渲染器
 */
export default class Renderer {
    /**
     * 画布
     */
    #canvas;
    #canvas_renderer;

    /**
     * 场景
     */
    #scene = new XThree.Scene();

    /**
     * 相机控制器
     */
    #orbit;

    /**
     * 渲染的元素
     */
    #object;

    /**
     * 动画帧回调
     */
    #animation_frame_handle;

    /**
     * 获取
     */
    get orbit() {
        return this.#orbit;
    }

    /**
     * 获取当前选的元素
     */
    get object() {
        return this.#object;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#orbit = new Orbit(this.#canvas, this);
        this.#canvas_renderer = new XThree.Renderer({
            powerPreference      : 'high-performance',
            antialias            : true,
            alpha                : true,
            precision            : 'highp',
            canvas               : this.#canvas,
            premultipliedAlpha   : true,
            preserveDrawingBuffer: true,
        });
    }

    /**
     * 
     * 设置新的渲染元素
     * 
     * @param {*} object 
     */
    setRenderObject(object) {
        if (this.#object) {
            throw new Error("already has render object");
        }
        this.#object = object;
        this.#scene.add(this.#object);
        this.renderNextFrame();
    }

    /**
     * 绘制
     */
    render() {
        this.canelIfNeedRenderNextFrame();
        if (this.#canvas_renderer) {
            this.#orbit.update();
            this.#canvas_renderer.render(this.#scene, this.#orbit.camera);
        }
    }

    /**
     * 下一帧绘制
     */
    renderNextFrame() {
        if (isUndefined(this.#animation_frame_handle)) {
            this.#animation_frame_handle = requestAnimationFrame(() => {
                this.render();
            });
        }
    }

    /**
     * 取消渲染
     */
    canelIfNeedRenderNextFrame() {
        if (!isUndefined(this.#animation_frame_handle)) {
            cancelAnimationFrame(this.#animation_frame_handle);
            this.#animation_frame_handle = undefined;
        }
    }

    /**
     * 
     * 重置
     * 
     * @param {*} ratio 
     * @param {*} width 
     * @param {*} height 
     */
    resize(ratio, width, height) {
        this.#orbit.resize(width, height);
        this.#canvas_renderer.setSize(width * ratio, height * ratio, false);
        this.renderNextFrame();
    }

    /**
     * 整体销毁
     */
    dispose() {
        this.#canvas_renderer.dispose();
        this.#canvas_renderer.forceContextLoss();
        this.#orbit.dispose();
    }
}
