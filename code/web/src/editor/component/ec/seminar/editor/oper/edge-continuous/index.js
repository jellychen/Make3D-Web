/* eslint-disable no-unused-vars */

import GlobalScope      from '@common/global-scope';
import ScopedParameters from '@core/houdini/scoped-parameters';
import Base             from '../base';

/**
 * 边连续
 */
export default class EdgeContinuous extends Base {
    /**
     * Wasm 对象链接
     */
    #connector;

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

        // 配置渲染器
        ;

        // 配置
        this.setCursor('default');
        this.setEnableSelector(false);
        this.setEnableSelectorTransformer(false);
    }

    /**
     * 销毁
     */
    dispose() {
        
    }
}
