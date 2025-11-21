/* eslint-disable no-unused-vars */

import Scene from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 开启或者关闭
     * 
     * @param {*} enable 
     */
    setEnableSelector(enable) {
        this.selector.setEnable(enable);
    }
});