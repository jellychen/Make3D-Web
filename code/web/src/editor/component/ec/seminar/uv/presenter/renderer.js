/* eslint-disable no-unused-vars */

import isUndefined      from 'lodash/isUndefined';
import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 点和线的颜色
 */
const DEFAULT_POINTS_COLOR        = 0xFFFFFF;
const DEFAULT_LINE_SEGMENTS_COLOR = 0xD2D2D2;

/**
 * 空
 */
const EMPTY_FLOAT32_ARRAY = new Float32Array([0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);

/**
 * 渲染器
 */
export default class Renderer {
    /**
     * 画布
     */
    #canvas;

    /**
     * 渲染
     */
    #renderer;

    /**
     * 场景和相机
     */
    #scene ;
    #camera;

    /**
     * 尺寸
     */
    #w;
    #h;
    #pixel_ratio;

    /**
     * 下一次执行渲染
     */
    #request_animation_frame_handle;

    /**
     * 渲染的元素
     */
    #points = new XThreeRenderable.PointRound();
    #line_segments = new XThreeRenderable.LineSegments();

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#renderer = new XThree.Renderer({
            canvas   : canvas,
            alpha    : true,
            antialias: true,
            preserveDrawingBuffer: true,
        });
        this.#points.setColor(DEFAULT_POINTS_COLOR);
        this.#points.setFeather(0.4);
        this.#points.setSize(8);
        this.#points.frustumCulled = false;

        this.#line_segments.setColor(DEFAULT_LINE_SEGMENTS_COLOR);
        this.#line_segments.setEnableDepthTest(false);
        this.#line_segments.frustumCulled = false;
        
        this.#camera = new XThree.OrthographicCamera(0, 1, 0, 1, -1, 1);
        this.#camera.up.set(0, 1, 0);
        this.#camera.position.set(0, 0, 0.1);
        this.#camera.lookAt(0, 0, 0);
        this.#scene = new XThree.Scene();
        this.#scene.add(this.#points);
        this.#scene.add(this.#line_segments);
    }

    /**
     * 执行回执
     */
    #draw() {
        if (this.#renderer && this.#scene && this.#camera) {
            this.#renderer.render(this.#scene, this.#camera);
        }
    }

    /**
     * 
     * 设置尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     * @param {*} pixel_ratio 
     */
    setSize(w, h, pixel_ratio = window.devicePixelRatio) {
        this.#pixel_ratio = pixel_ratio;
        this.#w = w;
        this.#h = h;
        this.#renderer.setPixelRatio(pixel_ratio);
        this.#renderer.setSize(w, h, true);
        this.renderNextFrame();
    }

    /**
     * 
     * 设置点的Buffer
     * 
     * @param {Float32Array} points_buffer 
     * @param {*} copy 
     */
    setPoints(points_buffer, copy = false) {
        if (!points_buffer) {
            this.#points.setPointsBuffer(EMPTY_FLOAT32_ARRAY);
        } else {
            this.#points.setPointsBuffer(points_buffer, copy);
        }
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Float32Array} points 
     */
    setLineSegments(points) {
        if (!points) {
            this.#line_segments.setSegments(EMPTY_FLOAT32_ARRAY);
        } else {
            this.#line_segments.setSegments(points.slice());
        }
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        if (!isUndefined(this.#request_animation_frame_handle)) {
            return;
        }
        this.#request_animation_frame_handle = requestAnimationFrame(() => {
            this.#request_animation_frame_handle = undefined;
            this.#draw();
        });
    }

    /**
     * 销毁
     */
    dispose() {
        const gl = this.#renderer.getContext();
        const lose_context = gl.getExtension('WEBGL_lose_context');
        if (lose_context) {
            lose_context.loseContext();
        }

        this.#line_segments.dispose();
        this.#points.dispose();
        this.#renderer.dispose();
        cancelAnimationFrame(this.#request_animation_frame_handle);
    }
}
