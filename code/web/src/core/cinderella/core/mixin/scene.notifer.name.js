/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 接收到，有元素的名称变化了
     * 
     * @param {string} reason 
     * @param {*} object 
     */
    onObjectNameWillChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-name-will-changed'
        });
    },

    /**
     * 
     * 接收到，有元素的名称变化了
     * 
     * @param {string} reason 
     * @param {*} object 
     */
    onObjectNameChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-name-changed'
        });
    },
});
