/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';
import Renderable       from './renderable';

/**
 * 链接编辑器
 * 
 * 需要依赖深度图，需要适当的时机重绘深度图
 */
export default class Linkup extends Base {
    /**
     * 核心渲染器
     */
    #cinderella;

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
     * 事件回调
     */
    #on_poineter_move = event => this.#onPointerMove(event);
    #on_click         = event => this.#onClick(event);
    #on_keyup         = event => this.#onKeyUp(event);

    /**
     * 标记当前的状态
     * 
     * 0 == 代表初始化状态
     * 1 == 代表选择了起始点，但是还没有选取结束点
     * 
     */
    #status = 0;

    /**
     * 用来标记鼠标移动的时候有没有找到最近的点
     */
    #status_hover_success = false;

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
        this.#cinderella               = coordinator.cinderella;
        this.#connector                = connector;
        this.#arena                    = arena;
        this.#connector_biz_controller = this.#connector.getManipulatorLinkup();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorLinkup error !!!");
        }

        // 构建显示单元，并添加到渲染
        this.#renderable = new Renderable(this.coordinator);
        this.#arena.add(this.#renderable);

        // 配置渲染器
        ;

        // 配置
        this.setCursor('pointer');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 监听事件
        this.interactive_controller.addEventListener('click', this.#on_click);
        this.interactive_controller.addEventListener('pointer-move', this.#on_poineter_move);
        this.keyboard_watcher.addEventListener('keyup', this.#on_keyup);
    }

    /**
     * 
     * 鼠标点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        if (0 == this.#status) {
            if (this.#status_hover_success) {
                if (this.#connector_biz_controller.sessionStart()) {
                    this.#status = 1;
                    this.setCursor('knife');
                } else {
                    throw new Error("Wasm Linkup SessionStart Error");
                }
            } else {
                return;
            }
        } else if (1 == this.#status) {
            if (this.#connector_biz_controller.cut()) {
                // 获取渲染的数据
                const renderable = this.#connector_biz_controller.getRenderable();
                const p = renderable.points();
                const l = renderable.line_segments_points();
                this.#renderable.setShowPoints_0(true);
                this.#renderable.setPoints_0(p);
                this.#renderable.setShowPoints_1(false);
                this.#renderable.setShowEdges(true);
                this.#renderable.setEdgesSegments(l);
                
                // 标记重绘
                this.#arena.markNeedUpdate();
                this.#arena.renderNextFrame();
            }
        }
    }

    /**
     * 
     * 鼠标滑动事件
     * 
     * @param {*} event 
     */
    #onPointerMove(event) {
        // 
        // 如果鼠标按下了按键，不进行拾取
        //
        if (event && event.buttons !== 0) {
            return;
        }

        // 是不是按下了 Shift 按键
        const shift_pressed = this.keyboard_watcher.shift;

        // 需要更新深度图
        this.#arena.depth_buffer_maintainer.captureAndSyncReadBufferIfNeed();

        // UI坐标系
        const x = event.x;
        const y = event.y;
        
        // 如果还不具备起始点
        if (0 == this.#status) {

            // 拾取前的准备
            this.prepareForPicker(x, y);

            // 根据拾取的情况做显示变化
            if (this.#connector.closestPoint(x, y)) {
                const point = {
                    x: 0,
                    y: 0,
                    z: 0,
                };
                ScopedParameters.getVec3(0, point);
                this.#renderable.setShowPoints_1(true);
                this.#renderable.setPoints_1(new Float32Array([point.x, point.y, point.z]));
                this.#status_hover_success = true;
            } else {
                this.#renderable.setShowPoints_1(false);
                this.#status_hover_success = false;
            }
        }

        // 寻找终结点
        else {
            // 拾取前的准备
            this.prepareForPicker(x, y);
            
            // 设置参数
            this.#connector_biz_controller.setCurrentInspectorCoordinate(x, y)

            // 执行嗅探
            this.#connector_biz_controller.sessionInspector(x, y);

            // 获取渲染的数据
            const renderable = this.#connector_biz_controller.getRenderable();
            const p = renderable.points();
            const l = renderable.line_segments_points();
            this.#renderable.setShowPoints_0(true);
            this.#renderable.setPoints_0(p);
            this.#renderable.setShowPoints_1(false);
            this.#renderable.setShowEdges(true);
            this.#renderable.setEdgesSegments(l);
        }
    }

    /**
     * 
     * 键盘按键弹起
     * 
     * @param {*} event 
     */
    #onKeyUp(event) {
        switch (event.key) {
        case 'Escape':
        case 'Enter':
            this.#completeSession();
            break;
        }
    }

    /**
     * 终止或者结束流程
     */
    #completeSession() {
        this.setCursor('pointer');
        this.#renderable.hiddenAll();
        this.#status = 0;
        this.#connector_biz_controller.sessionEnd();
    }

    /**
     * 销毁
     */
    dispose() {
        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator();

        // 移除渲染元素
        this.#renderable.removeFromParent();
        
        // 销毁事件
        this.interactive_controller.removeEventListener('click', this.#on_click);
        this.interactive_controller.removeEventListener('pointer-move', this.#on_poineter_move);
        this.keyboard_watcher.removeEventListener('keyup', this.#on_keyup);
    }
}
