/* eslint-disable no-unused-vars */

import Renderer       from './renderer';
import Curve          from './curve';
import CurveContainer from './curve-container';

/**
 * 顶点链接
 */
export default class NodesConnection {
    /**
     * dashboard
     */
    #dashboard;

    /**
     * 画布
     */
    #canvas;
    #canvas_resize_observer;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 动画
     */
    #animation_handle;

    /**
     * 曲线容器
     */
    #curve_container = new CurveContainer();

    /**
     * 临时曲线
     */
    #curve_temp = new Curve();

    /**
     * 拓扑
     */
    #topo;

    /**
     * 获取
     */
    get curve_container() {
        return this.#curve_container;
    }

    /**
     * 获取
     */
    get curve_temp() {
        return this.#curve_temp;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} dashboard 
     * @param {*} canvas 
     * @param {*} topo 
     */
    constructor(dashboard, canvas, topo) {
        this.#dashboard = dashboard;
        this.#canvas    = canvas;
        this.#topo      = topo;
        this.#curve_temp.enable_dash = true;
        this.#renderer = new Renderer(this.#canvas);
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize()
        });
        this.#canvas_resize_observer.observe(this.#dashboard);
    }

    /**
     * 
     * 拖动和缩放
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} scale 
     */
    panZoom(x, y, scale) {
        if (this.#renderer.panZoom(x, y, scale)) {
            this.render();
        }
    }

    /**
     * 尺寸发生了变化
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.#dashboard.offsetWidth;
        const h = this.#dashboard.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#canvas.style.width  = `${w}px`;
        this.#canvas.style.height = `${h}px`;
        this.#renderer.resize(ratio, w, h);
        this.render(false);
    }

    /**
     * 
     * 转化到UI
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    toUI(x, y) {
        return this.#renderer.toUI(x, y);
    }

    /**
     * 
     * 
     * 转化到局部
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    toLocal(x, y) {
        return this.#renderer.toLocal(x, y);
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} nextframe 
     */
    render(nextframe = true) {
        if (nextframe) {
            this.renderNextFrame();
        } else {
            if (this.#animation_handle) {
                cancelAnimationFrame(this.#animation_handle);
                this.#animation_handle = undefined;
            }

            const context = this.#renderer.dc;
            this.#renderer.begin();
            this.#topo.draw(context);
            this.#curve_container.draw(context);
            this.#curve_temp.draw(context);
            this.#renderer.end();
        }
    }

    /**
     * 下一帧绘制
     */
    renderNextFrame() {
        if (this.#animation_handle) {
            ;
        } else {
            this.#animation_handle = requestAnimationFrame(() => {
                this.#animation_handle = undefined;
                this.render(false);
            });
        }
    }
}
