/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';
import Renderable       from './renderable';
import Setter           from './v-setter';

/**
 * 常量
 */
const CUT_COUNT_MIN = 1;
const CUT_COUNT_MAX = 16;

/**
 * 环切编辑器
 * 
 * 需要依赖深度图，需要适当的时机重绘深度图
 */
export default class Circumcidere extends Base {
    /**
     * 设置器
     */
    #setter = new Setter();

    /**
     * Wasm 对象链接
     */
    #connector;

    /**
     * wasm 实现
     */
    #connector_biz_controller;

    /**
     * 显示单元的父容器
     */
    #arena;

    /**
     * 辅助显示的元素
     */
    #renderable;

    /**
     * 射线
     */
    #raycaster = new XThree.Raycaster();

    /**
     * 拾取中间
     */
    #pick_center = false;

    /**
     * 记录鼠标位置
     */
    #current_pointer_x = 0;
    #current_pointer_y = 0;

    /**
     * 
     * 环切的线段数量 0 -> 8
     * 1. 如果是一段，可能是任意位置
     * 2. 如果是多段，只能是均分
     */
    #cut_segments_count = 1;

    /**
     * 事件回调
     */
    #on_poineter_down       = event => this.#onPointerDown(event);
    #on_poineter_move       = event => this.#onPointerMove(event);
    #on_poineter_up         = event => this.#onPointerUp  (event);
    #on_click               = event => this.#onClick(event);
    #on_wheel               = event => this.#onWheel(event);
    #on_command_key_changed = event => this.#onCommandKeyChanged(event);

    /**
     * 记录当前拾取数据的版本，用来减少GPU数据传输的性能
     */
    #pick_data_version = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} arena 
     * @param {*} connector 
     * @param {*} host 
     */
    constructor(coordinator, arena, connector, host) {
        super(coordinator, arena, host);
        this.#connector                = connector;
        this.#arena                    = arena;
        this.#connector_biz_controller = this.#connector.getManipulatorCircumcidere();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorCircumcidere error !!!");
        }

        // 构建显示单元，并添加到渲染
        this.#renderable = new Renderable(this.coordinator);
        this.#arena.add(this.#renderable);

        // 配置渲染器
        ;

        // 配置
        this.setCursor('link');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 监听事件
        this.keyboard_watcher.addEventListener('command-key-changed', this.#on_command_key_changed);
        this.interactive_controller.addEventListener('click'        , this.#on_click);
        this.interactive_controller.addEventListener('pointer-down' , this.#on_poineter_down);
        this.interactive_controller.addEventListener('pointer-move' , this.#on_poineter_move);
        this.interactive_controller.addEventListener('pointer-up'   , this.#on_poineter_up  );
        this.interactive_controller.addEventListener('wheel'        , this.#on_wheel);

        // 显示设置
        this.#setter.show(this.abattoir.container);
        this.#setter.on_changed = count => this.#onSetterChanged(count);
    }

    /**
     * 
     * 鼠标点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        // 执行切割
        if (this.#connector_biz_controller.apply()) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 鼠标按下
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#renderable.setShowHighlight(true);
    }

    /**
     * 
     * 鼠标滑动事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 鼠标位置
        const x = event.x;
        const y = event.y;

        // 取消高亮
        this.#renderable.setShowHighlight(false);

        // 拾取
        this.#pick(x, y, event);

        // 记录位置
        this.#current_pointer_x = x;
        this.#current_pointer_y = y;
    }

    /**
     * 
     * 鼠标弹起
     * 
     * @param {*} event 
     */
    #onPointerUp(event) {
        this.#renderable.setShowHighlight(false);

        // 恢复成1次环切
        this.#setter.setCount(1);
        this.#cut_segments_count = 1;
    }

    /**
     * 
     * 滚轮发生了变化
     * 
     * @param {*} event 
     */
    #onWheel(event) {
        //
        // 按下了 shift
        //
        if (!this.keyboard_watcher.shift) {
            return;
        }
        
        // 调整环切数量
        const x = event.deltaX;
        const y = event.deltaY;
        let offset = 0;
        if (Math.abs(x) > Math.abs(y)) {
            offset = x;
        } else {
            offset = y;
        }

        let count = this.#cut_segments_count;
        if (offset > 0) {
            count--;
        } else {
            count++;
        }

        count = Math.clamp(count, CUT_COUNT_MIN, CUT_COUNT_MAX);
        if (this.#cut_segments_count != count) {
            this.#cut_segments_count = count;
            this.#setter.setCount(this.#cut_segments_count);
            this.#pick(this.#current_pointer_x, this.#current_pointer_y, event);
        }
    }

    /**
     * 
     * 键盘按键发生变化
     * 
     * 如果Shift按键按下，代表中心选取
     * 
     * @param {*} event 
     */
    #onCommandKeyChanged(event) {
        const shift_pressed = this.keyboard_watcher.shift;
        if (shift_pressed == this.#pick_center) {
            return;
        }
        this.#pick_center = shift_pressed;
        this.#pick(this.#current_pointer_x, this.#current_pointer_y, event);
    }

    /**
     * 
     * 拾取
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} event 
     * @param {*} capture_depth 
     * @returns 
     */
    #pick(x, y, event, capture_depth = true) {
        // 
        // 如果鼠标按下了按键，不进行拾取
        //
        if (event && event.buttons !== 0) {
            return;
        }

        // 可能需要更新深度图
        if (capture_depth) {
            this.#arena.depth_buffer_maintainer.captureAndSyncReadBufferIfNeed();
        }

        // 更新
        this.prepareForPicker(x, y);

        // 执行
        if (this.#cut_segments_count == 1) {
            this.#connector_biz_controller.pick(x, y, this.#pick_center);
        } else {
            this.#connector_biz_controller.pickMultipleSegments(x, y, this.#cut_segments_count);
        }

        // 判断数据版本
        const version = this.#connector_biz_controller.getPickDataVersion();
        if (this.#pick_data_version !== version) {
            this.#pick_data_version   = version;
            
            // 更新显示的线
            const edges = this.#connector_biz_controller.elector_edges_vertices();
            if (null == edges || edges.length == 0) {
                this.#renderable.setShowEdges(false);
            } else {
                this.#renderable.setShowEdges(true);
                this.#renderable.setEdgesSegments(edges);
            }
        }
    }

    /**
     * 
     * 设置器的变化
     * 
     * @param {*} count 
     */
    #onSetterChanged(count) {
        this.#cut_segments_count = count;
    }

    /**
     * 销毁
     */
    dispose() {
        // 销毁 Setter
        this.#setter.dismiss();
        
        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator();

        // 移除渲染元素
        this.#renderable.removeFromParent();

        // 销毁事件
        this.keyboard_watcher.removeEventListener('command-key-changed', this.#on_command_key_changed);
        this.interactive_controller.removeEventListener('click',         this.#on_click);
        this.interactive_controller.removeEventListener('pointer-down',  this.#on_poineter_down);
        this.interactive_controller.removeEventListener('pointer-move',  this.#on_poineter_move);
        this.interactive_controller.removeEventListener('pointer-up'  ,  this.#on_poineter_up  );
        this.interactive_controller.removeEventListener('wheel'       ,  this.#on_wheel        );
    }
}

