/* eslint-disable no-unused-vars */

import XThree            from '@xthree/basic';
import GlobalScope       from '@common/global-scope';
import ScopedParameters  from '@core/houdini/scoped-parameters';
import Base              from '../base';
import CenterSplitSetter from './v-center-split';

/**
 * 中心分拆
 */
export default class CenterSplit extends Base {
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
     * 用来设置
     */
    #setter = new CenterSplitSetter();

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
        this.#connector_biz_controller = this.#connector.getManipulatorFaceSplit();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorFaceSplit error !!!");
        }

        // 配置渲染器
        ;

        // 配置
        this.setCursor('default');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);

        // 显示控制器
        this.#setter.show(this.abattoir.container);
        this.#setter.on_value_changed = offset => this.#onSetterValueChanged(offset);
        this.#setter.on_cancel = () => this.#onCancle();
        this.#setter.on_commit = () => this.#onCommit();

        // 执行插入
        this.#connector_biz_controller.begin();

        // 更新
        this.#arena.markNeedUpdate();
        this.renderNextFrame();
    }s

    /**
     * 
     * 接收到值发生了变化
     * 
     * @param {} offset 
     */
    #onSetterValueChanged(offset) {
        this.#connector_biz_controller.setOffset(offset);
        this.#arena.markNeedUpdate();
        this.renderNextFrame();
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
        this.#setter.dismiss();

        // 终止
        if (this.#connector_biz_controller) {
            this.#connector_biz_controller.dismiss();
            this.#connector_biz_controller = undefined;
        }

        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator(); 
     }
}
