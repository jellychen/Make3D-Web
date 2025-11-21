/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';

/**
 * 细分
 */
export default class Subdivison extends Base {
    /**
     * Wasm 对象链接
     */
    #connector;

    /**
     * wasm 实现
     */
    #connector_biz_controller;

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
        this.#connector_biz_controller = this.#connector.getManipulatorSubdivision();
        if (!this.#connector_biz_controller) {
            throw new Error("getManipulatorSubdivision error !!!");
        }

        // 配置渲染器
        ;
        
        // 配置
        this.setCursor('default');
        this.setEnableSelector(true);
        this.setEnableSelectorTransformer(true);
    }

    /**
     * 销毁
     */
    dispose() {
        // 通知 Wasm 销毁
        this.#connector.disposeAllManipulator();
    }
}
