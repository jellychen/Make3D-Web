/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThreeRenderable from '@xthree/renderable';

/**
 * 边框
 */
export default class OutlineFrame {
    /**
     * 请求重绘
     */
    #request_animation_frame;

    /**
     * 渲染工具
     */
    #line_segments = new XThreeRenderable.LineSegmentsDash();

    /**
     * 坐标
     */
    #start_x = 0;
    #start_y = 0;
    #end_x   = 0;
    #end_y   = 0;

    /**
     * 标记mesh是不是发生了变化
     */
    #line_mesh_available = false;

    /**
     * 
     * 构造函数
     * 
     * @param {Function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        this.#request_animation_frame = request_animation_frame;
        this.#line_segments.setColor(0xFFFFFF);
        this.#line_segments.setWidth(1);
        this.#line_segments.setDash(4, 2);
        this.#line_segments.setEnableDepthTest(false);
    }

    /**
     * 
     * 渲染的尺寸发生了变化
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(width, height) {
        this.#line_segments.setResolution(width, height);
    }

    /**
     * 
     * 设置线宽的宽度
     * 
     * @param {Number} width 
     */
    setWidth(width) {
        this.#line_segments.setWidth(width);
        this.#request_animation_frame();
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#line_segments.setColor(color);
        this.#request_animation_frame();
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setStartPoint(x, y) {
        if (this.#start_x != x || this.#start_y != y) {
            this.#start_x = x;
            this.#start_y = y;
            this.#line_mesh_available = false;
        }
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setEndPoint(x, y) {
        if (this.#end_x != x || this.#end_y != y) {
            this.#end_x = x;
            this.#end_y = y;
            this.#line_mesh_available = false;
        }
    }

    /**
     * 
     * 执行绘制
     *
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.#line_mesh_available) {
            this.#line_mesh_available = true;
            const points = [];
            points.push(this.#start_x, this.#start_y, 0);
            points.push(this.#start_x, this.#end_y  , 0);
            points.push(this.#start_x, this.#start_y, 0);
            points.push(this.#end_x  , this.#start_y, 0);
            points.push(this.#start_x, this.#end_y  , 0);
            points.push(this.#end_x  , this.#end_y  , 0);
            points.push(this.#end_x  , this.#start_y, 0);
            points.push(this.#end_x  , this.#end_y  , 0);
            this.#line_segments.setSegments(points);
        }
        renderer.render(this.#line_segments, camera);
    }

    /**
     * 废弃
     */
    dispose() {
        this.#line_segments.dispose();
    }
}
