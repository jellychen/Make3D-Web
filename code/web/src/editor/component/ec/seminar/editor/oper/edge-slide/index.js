/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';
import Slider           from './v-slider';

/**
 * 边滑移
 */
export default class EdgeSlide extends Base {
    /**
     * Wasm 对象链接
     */
    #connector;

    /**
     * wasm 实现
     */
    #connector_biz_controller;

    /**
     * 用来显示
     */
    #arena;

    /**
     * 用来调整的滑块
     */
    #slider = new Slider();

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
        this.#connector_biz_controller = this.#connector.getManipulatorEdgeSlide();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorEdgeSlide error !!!");
        }

        // 配置渲染器
        ;

        // 配置
        this.setCursor('default');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 显示滑块
        this.#slider.show();
        this.#slider.moveTo(this.abattoir.anchor_bottom_right, "left-end");
        this.#slider.on_percent_changed = (percent) => this.#onSliderPercentChanged(percent);
        this.#slider.on_cancel = () => this.#onCancle();
        this.#slider.on_commit = () => this.#onCommit();

        // 初始化
        this.#connector_biz_controller.setup();
    }

    /**
     * 
     * Slider 变化， [-1, +1]
     * 
     * @param {Number} percent 
     */
    #onSliderPercentChanged(percent) {
        percent = parseFloat(percent);
        if (this.#connector_biz_controller.setOffset(percent)) {
            this.#arena.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 点击了取消
     */
    #onCancle() {
        if (this.#connector_biz_controller &&
            this.#connector_biz_controller.setOffset(0)) {
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
        this.#slider.dismiss();

        // 通知 Wasm 销毁
        this.#connector_biz_controller.dismiss();
        this.#connector.disposeAllManipulator();
    }
}
