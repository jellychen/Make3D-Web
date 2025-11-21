/* eslint-disable no-unused-vars */

import isUndefined       from 'lodash/isUndefined';
import XThree            from '@xthree/basic';
import Orbit             from './orbit';
import Coordinate        from './coordinate';
import MaterialSurface   from './material-surface';
import MaterialWireframe from './material-wireframe';

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
    #scene;

    /**
     * 坐标轴
     */
    #coordinate = new Coordinate();

    /**
     * 相机控制器
     */
    #orbit;

    /**
     * 动画帧回调
     */
    #animation_frame_handle;

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
            preserveDrawingBuffer: false,
        });
        this.#canvas_renderer.autoClear = false;
        this.#canvas_renderer.clear(true, true, true);
    }

    /**
     * 
     * 设置新的渲染元素
     * 
     * @param {*} scene 
     */
    setScene(scene) {
        this.#scene = scene;
        this.renderNextFrame();
    }

    /**
     * 绘制
     */
    render() {
        this.#orbit.update();
        this.canelIfNeedRenderNextFrame();
        this.#canvas_renderer.clear(true, true, true);

        if (this.#scene) {
            this.#scene.overrideMaterial = MaterialSurface;
            this.#canvas_renderer.render(this.#scene, this.#orbit.camera);
            this.#scene.overrideMaterial = MaterialWireframe;
            this.#canvas_renderer.render(this.#scene, this.#orbit.camera);
        }

        if (this.#coordinate) {
            this.#coordinate.render(this.#canvas_renderer, this.#orbit.camera);
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
     * 
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
