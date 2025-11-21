/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree                      from '@xthree/basic';
import EventDispatcher             from '@common/misc/event-dispatcher';
import Constants                   from './core/constants';
import Orbit                       from './controller/orbit';
import IsolateCameraTargetMoveable from './isolate-camera-target-moveable';

/**
 * 交互控制器，和3D世界的交互都在这个类中完成控制
 */
export default class IsolateInteractiveController extends EventDispatcher {
    /**
     * 页面元素
     */
    #attached_interactive = undefined;

    /**
     * 渲染逻辑
     */
    #isolate;
    #personal_cameraman;
    #renderer_pipeline;

    /**
     * 事件回调
     */
    #on_pointer_down;
    #on_pointer_move;
    #on_pointer_up;
    #on_pointer_cancel;
    #on_click;
    #on_dbclick;
    #on_wheel;

    /**
     * 可交互的元素
     */
    #transformer;                       // 变换组件
    #haft;                              // 单向拖拽
    #selectbox;                         // 框选
    #selectbox_respond_event = false;   // 框选对事件负责
    #orbit;                             // 调整视角
    #camera_target_moveable;            // 移动相机

    /**
     * 事件分发逻辑
     */
    #event_has_responder = false;
    #event_responder_cluster = new Array();

    /**
     * 事件追踪
     */
    #current_pointer_down = false;
    #pointer_down_x = 0;
    #pointer_down_y = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} interactive 
     * @param {*} isolate 
     * @param {*} renderer_pipeline 
     */
    constructor(interactive, isolate, renderer_pipeline) {
        super();

        // 一些重要组件
        this.#attached_interactive = interactive;
        this.#isolate = isolate;
        this.#personal_cameraman = isolate.getPersonalCameraman();
        this.#renderer_pipeline = renderer_pipeline;

        // 可以交互的组件
        this.#transformer = this.#renderer_pipeline.transformer;
        this.#haft        = this.#renderer_pipeline.haft;
        this.#selectbox   = this.#renderer_pipeline.selectbox;
        this.#orbit       = this.#isolate.getOrbit();
        this.#camera_target_moveable = new IsolateCameraTargetMoveable(isolate, interactive);

        // 鼠标事件
        this.#on_pointer_down   = event=> this.#onPointerDown(event);
        this.#on_pointer_move   = event=> this.#onPointerMove(event);
        this.#on_pointer_up     = event=> this.#onPointerUp(event);
        this.#on_pointer_cancel = event=> this.#onPointerCancel(event);
        this.#on_wheel          = event=> this.#onWheel(event);
        this.#on_click          = event=> this.#onClick(event);
        this.#on_dbclick        = event=> this.#onDbClick(event);
        
        // 事件分发池子, 在前面的优先分发
        this.#event_responder_cluster.push({ element: this.#orbit,                  responder: false });
        this.#event_responder_cluster.push({ element: this.#transformer,            responder: false });
        this.#event_responder_cluster.push({ element: this.#haft,                   responder: false });
        this.#event_responder_cluster.push({ element: this.#camera_target_moveable, responder: false });

        // 默认是打开的
        this.setEnable(true)
    }

    /**
     * 
     * 设置是不是可用
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.#attached_interactive.addEventListener   ('pointerdown',   this.#on_pointer_down);
            this.#attached_interactive.addEventListener   ('pointerup',     this.#on_pointer_up);
            this.#attached_interactive.addEventListener   ('pointermove',   this.#on_pointer_move);
            this.#attached_interactive.addEventListener   ('pointercancel', this.#on_pointer_cancel);
            this.#attached_interactive.addEventListener   ('wheel',         this.#on_wheel);
            this.#attached_interactive.addEventListener   ('click',         this.#on_click);
            this.#attached_interactive.addEventListener   ('dblclick',      this.#on_dbclick);
        } else {
            this.#attached_interactive.removeEventListener('pointerdown',   this.#on_pointer_down);
            this.#attached_interactive.removeEventListener('pointerup',     this.#on_pointer_up);
            this.#attached_interactive.removeEventListener('pointermove',   this.#on_pointer_move);
            this.#attached_interactive.removeEventListener('pointercancel', this.#on_pointer_cancel);
            this.#attached_interactive.removeEventListener('wheel',         this.#on_wheel);
            this.#attached_interactive.removeEventListener('click',         this.#on_click);
            this.#attached_interactive.removeEventListener('dblclick',      this.#on_dbclick);
        }
    }

    /**
     * 
     * 获取包围盒
     * 
     * @returns 
     */
    getBoundingClientRect() {
        return this.#attached_interactive.getBoundingClientRect();
    }

    /**
     * 
     * 鼠标按下的事件
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        // 记录事件数据
        this.#attached_interactive.setPointerCapture(event.pointerId);
        this.#pointer_down_x = event.x;
        this.#pointer_down_y = event.y;
        this.#current_pointer_down = true;
        
        // 依次判断交互组件，需不要负责
        for (const i of this.#event_responder_cluster) {
            if (i.element.dispathPointerDown(event)) {
                i.element.responder = true;
                this.#event_has_responder = true;
            } else {
                i.element.responder = false;
            }
        }

        // 获取
        const rect = this.getBoundingClientRect();

        // 如果没有交互组件响应, 有可能是框选
        if (!this.#event_has_responder) {    
            const x = event.x - rect.left - rect.width / 2.0;
            const y = rect.height / 2.0 - event.y + rect.top;
            this.#selectbox.setStartPoint(x, y);
        }

        // 对外发送事件
        this.dispatchEvent('pointer-down', {
            x : event.x - rect.left,
            y : event.y - rect.top ,
            buttons: event.buttons,
        });
    }

    /**
     * 
     * 鼠标移动的事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 如果有交互组件对事件负责，发给他
        if (this.#event_has_responder) {
            for (const i of this.#event_responder_cluster) {
                if (!i.element.responder) {
                    continue;
                }
                i.element.dispathPointerMove(event);
            }
        } else {
            // 无差别分发给每个交互组件
            for (const i of this.#event_responder_cluster) {
                i.element.dispathPointerMove(event);
            }

            // 位置在按键按下的情况下，发生了Move
            // 并且其他交互组件没有对这个事件流复杂
            // 认定是框选
            if (this.#current_pointer_down) {
                let x  = event.x;
                let y  = event.y;
                const dx = Math.abs(this.#pointer_down_x - x);
                const dy = Math.abs(this.#pointer_down_y - y);

                // 防止误触发
                if (dx > 5 && dy > 5 || this.#selectbox_respond_event) {
                    // 判断是不是需要发送事件
                    if (!this.#selectbox_respond_event) {
                        this.dispatchEvent('box-select-begin', {});
                        this.#selectbox_respond_event = true;
                    }

                    // 更新显示框的位置
                    const r = this.getBoundingClientRect();
                    x = x - r.left - r.width / 2.0;
                    y = r.height / 2.0 - y + r.top;
                    this.#selectbox.setEndPoint(x, y);

                    // 转 NDC
                    const half_i_w = 1.0 / r.width  * 2.0;
                    const half_i_h = 1.0 / r.height * 2.0;

                    // 发送事件
                    this.dispatchEvent('box-select-changed', {
                        x0 : this.#selectbox.x0 * half_i_w,
                        x1 : this.#selectbox.x1 * half_i_w,
                        y0 : this.#selectbox.y0 * half_i_h,
                        y1 : this.#selectbox.y1 * half_i_h,
                    });
                }
            }
        }

        // 对外发送事件
        const rect = this.getBoundingClientRect();
        this.dispatchEvent('pointer-move', {
            x : event.x - rect.left,
            y : event.y - rect.top ,
            buttons: event.buttons,
        });
    }

    /**
     * 
     * 鼠标抬起事件
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        // 记录事件数据
        this.#current_pointer_down = false;

        // 如果事件被可交互的组件接管了，还是交给他们处理
        if (this.#event_has_responder) {
            for (const i of this.#event_responder_cluster) {
                if (!i.element.responder) {
                    continue;
                }
                i.element.responder = false;
                i.element.dispathPointerUp(event);
            }
            this.#event_has_responder = false;
        }

        // 如果是框选组件接管了
        else if (this.#selectbox_respond_event) {
            // 转 NDC
            const r = this.getBoundingClientRect();
            const half_i_w = 1.0 / r.width  * 2.0;
            const half_i_h = 1.0 / r.height * 2.0;

            // 发送事件
            this.dispatchEvent('box-select-end', {
                x0 : this.#selectbox.x0 * half_i_w,
                x1 : this.#selectbox.x1 * half_i_w,
                y0 : this.#selectbox.y0 * half_i_h,
                y1 : this.#selectbox.y1 * half_i_h,
            });

            // 更新显示位置
            this.#selectbox.setEmptyArea();
            this.#selectbox_respond_event = false;
        }

        // 点击了非控件的的区域
        else {
            // 发送事件
            const rect = this.getBoundingClientRect();
            this.dispatchEvent('click', {
                x : event.x - rect.left,
                y : event.y - rect.top ,
                buttons: event.buttons,
            });
        }

        // 对外发送事件
        const rect = this.getBoundingClientRect();
        this.dispatchEvent('pointer-up', {
            x : event.x - rect.left,
            y : event.y - rect.top ,
            buttons: event.buttons,
        });
    }

    /**
     * 
     * 鼠标放弃事件
     * 
     * @param {*} event 
     */
    #onPointerCancel(event) {
        this.#current_pointer_down = false;
        this.#selectbox.setEmptyArea();

        // 如果事件被接管了
        if (this.#event_has_responder) {
            for (const i of this.#event_responder_cluster) {
                if (!i.element.responder) {
                    continue;
                }
                i.element.responder = false;
                i.element.dispathPointerCancel(event);
            }
            this.#event_has_responder = false;
        }

        // 标记状态
        for (const i of this.#event_responder_cluster) {
            i.element.responder = false;
        }
    }

    /**
     * 
     * 鼠标滚轮事件，调整相机的远近
     * 
     * @param {*} event 
     */
    #onWheel(event) {
        // 发送事件
        this.dispatchEvent('wheel', {
            deltaX : event.deltaX,
            deltaY : event.deltaY,
            buttons: event.buttons,
        });

        // 如果按下功能键不执行相机的拉伸
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        // 按照最大的滚动方向，来缩放
        const x = event.deltaX;
        const y = event.deltaY;
        let max_offset = 0;
        if (Math.abs(x) > Math.abs(y)) {
            max_offset = x;
        } else {
            max_offset = y;
        }

        // 当前的距离
        const current_distance = this.#orbit.getDistance();
        const max_segment = current_distance * 0.05;

        // 单次滚动不要超过 十分之一
        if (Math.abs(max_offset) > max_segment ) {
            max_offset = Math.sign(max_offset) * max_segment;
        }

        // 调整相机的位置
        const distance = this.#orbit.getDistance() + max_offset;
        if (distance <= Constants.ORBIT_DISTANCE_MIN) {
            this.#orbit.setDistance(Constants.ORBIT_DISTANCE_MIN);
        } else if (distance >= Constants.ORBIT_DISTANCE_MAX) {
            this.#orbit.setDistance(Constants.ORBIT_DISTANCE_MAX);
        } else {
            this.#orbit.setDistance(distance);
        }
    }

    /**
     * 
     * 点击事件
     * 
     * @param {*} event 
     */
    #onClick(event) {
        ;
    }

    /**
     * 
     * 双击事件
     * 
     * @param {*} event 
     */
    #onDbClick(event) {
        const r = this.getBoundingClientRect();
        this.dispatchEvent('dbclick', {
            x : event.x - r.left,
            y : event.y - r.top ,
            buttons: event.buttons,
        });
    }

    /**
     * 请求下一帧渲染
     */
    requestAnimationFrame() {
        this.#isolate.requestAnimationFrame();
    }
}
