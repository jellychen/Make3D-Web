/* eslint-disable no-unused-vars */

import isFunction        from "lodash/isFunction";
import ColosseumRenderer from "./colosseum-renderer";
import Curve             from "./curve";

/**
 * 舞台
 */
export default class Colosseum {
    /**
     * 宿主
     */
    host;
    host_canvas;

    /**
     * 截面数据
     */
    curve = new Curve();

    /**
     * 渲染管理
     */
    colosseum_renderer;

    /**
     * scale
     */
    scale = 1.0;

    /**
     * 用来标记
     */
    pointerdown       = false;
    pointer_current_x = 0;
    pointer_current_y = 0;
    pointerdown_x     = 0;
    pointerdown_y     = 0;

    /**
     * 
     * selected中
     * 
     * 如果选择点：selected就是点的索引
     * 如果选择边：selected就是边的索引
     */
    selected = undefined;

    /**
     * 交互方式
     */
    oper = 'select-point';

    /**
     * 
     * 操作
     * 
     * @returns 
     */
    get isOper_SelectPoint() {
        return this.oper == 'select-point';
    }

    /**
     * 
     * 操作
     * 
     * @returns 
     */
    get isOper_SelectCurve() {
        return this.oper == 'select-curve';
    }

    /**
     * 
     * 操作
     * 
     * @returns 
     */
    get isOper_Subdivision() {
        return this.oper == 'subdivision';
    }

    /**
     * 
     * 操作
     * 
     * @returns 
     */
    get isOper_DeleteCurve() {
        return this.oper == 'delete-curve';
    }

    /**
     * 
     * 是否是操作曲线
     * 
     * @returns 
     */
    get isOper_Curve() {
        return this.isOper_SelectCurve || 
               this.isOper_Subdivision || 
               this.isOper_DeleteCurve;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} canvas 
     */
    constructor(host, canvas) {
        this.host               = host;
        this.host_canvas        = canvas;
        this.colosseum_renderer = new ColosseumRenderer(this.curve);
        this.host_canvas.onpointerdown = event => {
            const x = this.toDC_X(event.offsetX) / this.scale;
            const y = this.toDC_Y(event.offsetY) / this.scale;
            this.onPointerDown(x, y);
            this.host_canvas.setPointerCapture(event.pointerId);
        };

        this.host_canvas.onpointermove = event => {
            const x = this.toDC_X(event.offsetX) / this.scale;
            const y = this.toDC_Y(event.offsetY) / this.scale;
            this.onPointerMove(x, y);
        };

        this.host_canvas.onpointerup   = event => {
            const x = this.toDC_X(event.offsetX) / this.scale;
            const y = this.toDC_Y(event.offsetY) / this.scale;
            this.onPointerUp(x, y);
            this.host_canvas.releasePointerCapture(event.pointerId);
        };
        
        this.host_canvas.onpointercancel = event => {
            this.onPointerUp();
            this.host_canvas.releasePointerCapture(event.pointerId);
        };

        this.host_canvas.onwheel = event => this.onWheel(event);
        
        this.curveReset();
    }

    /**
     * 
     * 转化到DC空间
     * 
     * @param {*} x 
     * @returns 
     */
    toDC_X(x) {
        return x - this.host_canvas.offsetWidth / 2;
    }

    /**
     * 
     * 转化到DC空间
     * 
     * @param {*} y 
     * @returns 
     */
    toDC_Y(y) {
        return this.host_canvas.offsetHeight / 2 - y;
    }

    /**
     * 
     * 渲染
     * 
     * @param {*} renderer 
     */
    draw(renderer) {
        renderer.dc.scale(this.scale, this.scale);
        this.colosseum_renderer.draw(renderer);
    }

    /**
     * 立刻执行渲染
     */
    render() {
        if (this.host && isFunction(this.host.render)) {
            this.host.render();
        }
    }

    /**
     * 下一帧执行
     */
    renderNextframe() {
        if (this.host && isFunction(this.host.renderNextframe)) {
            this.host.renderNextframe();
        }
    }

    /**
     * 通知外部
     */
    triggerChanged() {
        if (isFunction(this.host.onchanged)) {
            this.host.onchanged();
        }
    }
}
