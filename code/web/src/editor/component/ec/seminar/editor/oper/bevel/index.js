/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';
import BevelSetter      from './v-bevel';

/**
 * 倒角倒圆
 */
export default class Bevel extends Base {
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
     * 用来调整倒角的设置面板
     */
    #setter = new BevelSetter();

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
        this.#connector_biz_controller = this.#connector.getManipulatorBevel();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorBevel error !!!");
        }

        // 配置渲染器
        ;
        
        // 配置
        this.setCursor('default');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 显示控制器
        this.#setter.show(this.abattoir.container);
        this.#setter.on_value_changed = (o, s) => this.#onSetterValueChanged(o, s);
        this.#setter.on_cancel = () => this.#onCancle();
        this.#setter.on_commit = () => this.#onCommit();

        // 初始化
        this.#connector_biz_controller.setup();
    }

    /**
     * 
     * 接收到值发生了变化
     * 
     * @param {} offset 
     * @param {*} segments 
     */
    #onSetterValueChanged(offset, segments) {
        this.#connector_biz_controller.edgesBevelAndFilletRoundCorner(offset, segments);
        this.#arena.markNeedUpdate();
        this.renderNextFrame();
    }

    /**
     * 点击了取消
     */
    #onCancle() {
        if (this.#connector_biz_controller && 
            this.#connector_biz_controller.cancel()) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
        this.dismiss();
    }

    /**
     * 点击了确认提交
     */
    #onCommit() {
        this.dismiss();
    }

    /**
     * 销毁
     */
    dispose() {
        // 移除UI
        this.#setter.dismiss();

        // 通知 Wasm 销毁
        this.#connector_biz_controller.dismiss();
        this.#connector.disposeAllManipulator();
    }
}
