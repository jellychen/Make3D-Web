/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 事件分发
     * 
     * @param {*} event 
     */
    dispatchCustomEvent(event) {
        this.traverse(object3d => object3d.onEvent(event), false);
    }
});
