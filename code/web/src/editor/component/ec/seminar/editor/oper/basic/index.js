/* eslint-disable no-unused-vars */

import isString         from 'lodash/isString';
import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';

/**
 * 空编辑器
 */
export default class Basic extends Base {
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
     * 事件回调
     */
    #on_keydown = event => this.#onKeyDown(event);
    #on_keyup   = event => this.#onKeyUp  (event);

    /**
     * 延迟选择
     */
    #defer_select_all_timer = undefined;

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
        this.#connector_biz_controller = this.#connector.getManipulatorBasic();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorBasic error !!!");
        }

        // 获取设置
        const setter = host.setter;

        // 配置渲染器
        this.cinderella_conf_context.setDisableAll();
        this.cinderella_conf_context.setEnableRenderScene(!setter.show_only);
        this.cinderella_conf_context.setEnableCursor(true);
        this.cinderella_conf_context.setEnableSelectBox(true);
        this.cinderella_conf_context.setEnableCoordinate(setter.show_coordinate);

        // 配置
        this.setCursor('pointer');
        this.setEnableSelector(true);
        this.setEnableSelectorTransformer(true);
        this.host.updateSelectorTransformerIfEnable();
        this.renderNextFrame();

        // 监听事件
        this.keyboard_watcher.addEventListener('keydown', this.#on_keydown);
        this.keyboard_watcher.addEventListener('keyup'  , this.#on_keyup);
    }

    /**
     * 选择全部
     */
    #selectAll() {
        const select_mode = this.host.toolbar.select_mode;
        switch (select_mode) {
        case 'v':
            if (this.#connector_biz_controller.selectAllVertices()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;

        case 'e':
            if (this.#connector_biz_controller.selectAllEdges()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;

        case 'f':
            if (this.#connector_biz_controller.selectAllFaces()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;
        }
    }

    /**
     * 
     * 键盘按下
     * 
     * 在Mac系统下，按下Command 按键后不能回触发 keyup 事件
     * 所以按下 Command + A 需要处理下
     * 
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        if (!event || !isString(event.code)) {
            return;
        }

        //
        // 针对 metaKey + A 的操作
        //
        if (event.metaKey && 'KeyA' === event.code) {
            if (this.#defer_select_all_timer) {
                clearTimeout(this.#defer_select_all_timer);
            }

            this.#defer_select_all_timer = setTimeout(() => {
                this.#selectAll();
                this.#defer_select_all_timer = undefined;
            }, 200);
        }
    }

    /**
     * 
     * 键盘按键弹起
     * 
     * @param {*} event 
     */
    #onKeyUp(event) {
        if (!event || !isString(event.code)) {
            return;
        }

        switch (event.code) {
        case 'Backspace':                                   // 回删按键
            this.#onKeyUp_Backspace(event);
            break;
        
        case 'KeyA':                                        // Ctrl + a / A
            if (event.ctrlKey) {
                this.#selectAll();
            }
            break;
        }
    }

    /**
     * 
     * 按了删除按键
     * 
     * @param {*} event 
     */
    #onKeyUp_Backspace(event) {
        const select_mode = this.host.toolbar.select_mode;
        switch (select_mode) {
        case 'v':
            if (this.#connector_biz_controller.deleteSelectedVertices()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;

        case 'e':
            if (this.#connector_biz_controller.deleteSelectedEdges()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;

        case 'f':
            if (this.#connector_biz_controller.deleteSelectedFaces()) {
                this.#arena.markNeedUpdate();
                this.host.updateSelectorTransformerIfEnable();
                this.renderNextFrame();
            }
            break;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator();

        // 销毁事件
        this.keyboard_watcher.removeEventListener('keydown', this.#on_keydown);
        this.keyboard_watcher.removeEventListener('keyup',   this.#on_keyup);
    }
}
