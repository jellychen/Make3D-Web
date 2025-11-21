/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import Rect         from './rect';
import OutlineFrame from './outline-frame';

/**
 * 用来绘制选择框
 */
export default class SelectBox extends XThree.EventDispatcher {
    /**
     * 请求重绘函数
     */
    #request_animation_frame = () => {};

    /**
     * 标记是不是有效
     */
    #enable = false;

    /**
     * 主动监听事件
     */
    #enable_event_owner = true;

    /**
     * 屏幕尺寸
     */
    #screen_w = 0;
    #screen_h = 0;

    /**
     * 正交相机
     */
    #camera = new XThree.OrthographicCamera();

    /**
     * 监听DOM的事件
     */
    #attached_interactive;

    /**
     * 需要进行渲染的元素
     */
    #rect;
    #outline_frame;

    /**
     * 监听的事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;

    /**
     * 表示当前的组件是不是接管了
     */
    #is_take_over = false;

    /**
     * 记录区域
     */
    #area_x0;
    #area_y0;
    #area_x1;
    #area_y1;

    /**
     * 获取尺寸
     */
    get width() {
        return this.#screen_w;
    }

    /**
     * 获取尺寸
     */
    get height() {
        return this.#screen_h;
    }

    /**
     * 判断是不是需要绘制
     */
    get hasSomethingNeedRender() {
        return this.#is_take_over;
    }

    /**
     * 获取选择区域
     */
    get x0() {
        return this.#area_x0;
    }

    /**
     * 获取选择区域
     */
    get x1() {
        return this.#area_x1;
    }

    /**
     * 获取选择区域
     */
    get y0() {
        return this.#area_y0;
    }

    /**
     * 获取选择区域
     */
    get y1() {
        return this.#area_y1;
    }

    /**
     * 判断可用性
     */
    get enable() {
        return this.#enable;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {Function} request_animation_frame 
     * @param {*} interactive 
     * @param {Boolean} enable_event_owner 
     */
    constructor(request_animation_frame, interactive, enable_event_owner = true) {
        super();
        this.#request_animation_frame = request_animation_frame;
        this.#attached_interactive    = interactive;
        this.#enable_event_owner      = enable_event_owner;

        // 请求重绘回调
        const _request_animation_frame = () => {
            if (this.#enable) {
                request_animation_frame();
            }
        };

        // 元素
        this.#rect = new Rect(_request_animation_frame);
        this.#outline_frame = new OutlineFrame(_request_animation_frame);

        // 监听事件
        this.#on_pointer_down   = event => this.#onPointerDown(event);
        this.#on_pointer_move   = event => this.#onPointerMove(event);
        this.#on_pointer_up     = event => this.#onPointerUp(event);
        this.#on_pointer_cancel = event => this.#onPointerCancel(event);

        // 初始化状态
        this.setEnable(true);
    }

    /**
     * 
     * 设置是不是有效
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        enable = true === enable;
        if (enable == this.#enable) {
            return;
        }

        // 如果主动监听事件
        if (this.#enable_event_owner) {
            if (enable) {
                this.attach();
            } else {
                this.detach();
            }
        }
        
        this.#enable = enable;
        this.visible = enable;
        this.#requestAnimationFrameIfNeed();
    }

    /**
     * 添加对事件的监听
     */
    attach() {
        this.#attached_interactive.addEventListener('pointerdown',   this.#on_pointer_down);
        this.#attached_interactive.addEventListener('pointermove',   this.#on_pointer_move);
        this.#attached_interactive.addEventListener('pointerup',     this.#on_pointer_up);
        this.#attached_interactive.addEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 取消对事件的监听
     */
    detach() {
        this.#attached_interactive.removeEventListener('pointerdown',   this.#on_pointer_down);
        this.#attached_interactive.removeEventListener('pointermove',   this.#on_pointer_move);
        this.#attached_interactive.removeEventListener('pointerup',     this.#on_pointer_up);
        this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
    }

    /**
     * 
     * 设置边框的颜色
     * 
     * @param {*} color 
     */
    setFrameColor(color) {
        this.#outline_frame.setColor(color);
    }

    /**
     * 
     * 设置中间的颜色
     * 
     * @param {*} color 
     */
    setRectColor(color, alpha) {
        this.#rect.setColor(color, alpha);
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setStartPoint(x, y) {
        this.#area_x0 = x;
        this.#area_y0 = y;
        this.#area_x1 = x;
        this.#area_y1 = y;
        this.#rect.setStartPoint(x, y);
        this.#rect.setEndPoint(x, y);
        this.#outline_frame.setStartPoint(x, y);
        this.#outline_frame.setEndPoint(x, y);
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setEndPoint(x, y) {
        this.#area_x1 = x;
        this.#area_y1 = y;
        this.#outline_frame.setEndPoint(x, y);
        this.#rect.setEndPoint(x, y);
        this.#requestAnimationFrameIfNeed();
    }

    /**
     * 
     * 设置显示的区域
     * 
     * @param {Number} start_x 
     * @param {Number} start_y 
     * @param {Number} end_x 
     * @param {Number} end_y 
     */
    setArea(start_x, start_y, end_x, end_y) {
        this.#area_x0 = start_x;
        this.#area_y0 = start_y;
        this.#area_x1 = end_x;
        this.#area_y1 = end_y;
        this.setStartPoint(start_x, start_y);
        this.setEndPoint(end_x, end_y);
    }

    /**
     * 清空选择区域
     */
    setEmptyArea() {
        const has_area = this.#area_x0 !== this.#area_x1 && this.#area_y0 !== this.#area_y1;
        this.#area_x0 = 0;
        this.#area_y0 = 0;
        this.#area_x1 = 0;
        this.#area_y1 = 0;
        if (has_area && this.#enable) {
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
     * @returns 
     */
    resize(pixel_ratio, width, height) {
        if (this.#screen_w == width && this.#screen_h == height) {
            return;
        }

        this.#screen_w          = width;
        this.#screen_h          = height;
        this.#camera.left       = -this.#screen_w / 2.0;
        this.#camera.right      = +this.#screen_w / 2.0;
        this.#camera.top        = +this.#screen_h / 2.0;
        this.#camera.bottom     = -this.#screen_h / 2.0;
        this.#camera.near       = 0.1;
        this.#camera.far        = 1000;
        this.#camera.position.z = 10;
        this.#camera.updateProjectionMatrix();
        this.#outline_frame.resize(width, height);
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerDown(event) {
        this.#onPointerDown(event);
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerMove(event) {
        this.#onPointerMove(event);
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerUp(event) {
        this.#onPointerUp(event);
    }

    /**
     * 
     * 外部的事件分发
     * 
     * @param {*} event 
     */
    dispathPointerCancel(event) {
        this.#onPointerCancel(event);
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        if (!this.#enable) {
            return;
        }

        // 必须是鼠标左键
        if (event.button != 0 || event.buttons != 1) {
            return;
        }
        
        // 按下Command/Alt/Ctrl不生效
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        // 如果允许自己管理事件
        if (this.#enable_event_owner) {
            this.#attached_interactive.setPointerCapture(event.pointerId);
        }

        // 标记
        this.#is_take_over = true;

        // 
        const r = this.#attached_interactive.getBoundingClientRect();
        const x = event.x - r.left - r.width / 2.0;
        const y = r.height / 2.0 - event.y + r.top;
        this.setArea(x, y, x, y);
        this.dispatchEvent({type: 'before-selected'});
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        if (!this.#is_take_over || !this.#enable) {
            return;
        }

        const r = this.#attached_interactive.getBoundingClientRect();
        const x = event.x - r.left - r.width / 2.0;
        const y = r.height / 2.0 - event.y + r.top;
        this.setEndPoint(x, y);
        this.normalize();
        this.dispatchEvent({type: 'selected-changed'});
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        if (!this.#is_take_over || !this.#enable) {
            return;
        }

        this.#is_take_over = false;
        this.setArea(0, 0, 0, 0);
        this.#requestAnimationFrameIfNeed();
        this.dispatchEvent({type: 'after-selected'});
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.onPointerUp(event);
    }

    /**
     * 
     * is_take_over
     * 
     * @param {*} renderer 
     */
    render(renderer) {
        if (!this.#enable) {
            return;
        }

        // 如果区域是空直接跳出
        if (this.#area_x0 == this.#area_x1 || this.#area_y0 == this.#area_y1) {
            return;
        }

        // 执行绘制
        renderer.autoClear = false;
        this.#rect.render(renderer, this.#camera);
        this.#outline_frame.render(renderer, this.#camera);
    }

    /**
     * 如果有必要下一帧进行渲染
     */
    #requestAnimationFrameIfNeed() {
        this.#request_animation_frame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
        this.#outline_frame.dispose();
        this.#rect.dispose();
    }
}
