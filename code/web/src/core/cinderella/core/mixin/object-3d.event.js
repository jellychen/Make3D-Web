/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 
 * Mixin
 * 
 * 事件
 * 
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 接收到事件
     * 
     * @param {*} event 
     */
    onEvent(event) {
        const adapters = this.userData.event_adapters;
        if (adapters) {
            adapters.onEvent(event);
        }
    }
});