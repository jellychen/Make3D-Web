/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree             from '@xthree/basic';
import OverlappedLinedash from './overlapped-linedash';

/**
 * 覆盖层
 */
export default class Overlapped extends XThree.Group {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 正交相机
     */
    #camera = new XThree.OrthographicCamera();

    /**
     * 屏幕尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 虚线
     */
    #overlapped_linedash;
    #overlapped_linedash_visible = false;

    /**
     * 
     * 构造函数
     * 
     * @param {function} request_animation_frame 
     */
    constructor(request_animation_frame) {
        super();
        
        // 构建虚线
        this.#overlapped_linedash = new OverlappedLinedash(request_animation_frame);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} color 
     */
    setLineDashColor(color) {
        this.#overlapped_linedash.setColor(color);
        this.#requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setLineDashStartPoint(x, y) {
        this.#overlapped_linedash.setStartPoint(x, y);
        this.#overlapped_linedash.setEndPoint  (x, y);
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setLineDashEndPoint(x, y) {
        this.#overlapped_linedash.setEndPoint(x, y);
    }

    /**
     * 
     * 设置显示虚线
     * 
     * @param {boolean} show 
     */
    setShowLineDash(show) {
        show = true === show;
        if (show !== this.#overlapped_linedash_visible) {
            this.#overlapped_linedash_visible = show;
            this.#requestAnimationFrameIfNeed();
        }
    }

    /**
     * 
     * 尺寸发生变化
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        if (this.#w == width && this.#h == height) {
            return;
        }

        this.#w                 = width;
        this.#h                 = height;
        this.#camera.left       = -this.#w / 2.0;
        this.#camera.right      = +this.#w / 2.0;
        this.#camera.top        = +this.#h / 2.0;
        this.#camera.bottom     = -this.#h / 2.0;
        this.#camera.near       = 0.1;
        this.#camera.far        = 1000;
        this.#camera.position.z = 10;
        this.#camera.updateProjectionMatrix();

        // 调整虚线
        this.#overlapped_linedash.resize(pixel_ratio, width, height);
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     */
    render(renderer) {
        renderer.autoClear = false;
        renderer.render(this, this.#camera);

        // 渲染虚线
        if (this.#overlapped_linedash_visible) {
            this.#overlapped_linedash.render(renderer, this.#camera);
        }
    }

    /**
     * 如果有必要下一帧进行渲染
     */
    #requestAnimationFrameIfNeed() {
        if (this.#request_animation_frame) {
            this.#request_animation_frame();
        }
    }

    /**
     * 废弃
     */
    dispose() {
        this.#overlapped_linedash.dispose();
    }
}
