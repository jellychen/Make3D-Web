/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 接收到，有元素可视变化了
     * 
     * @param {*} reason 
     * @param {*} object 
     */
    onObjectVisibleWillChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-visible-will-changed'
        });
    },

    /**
     * 
     * 接收到，有元素可视变化了
     * 
     * @param {*} reason 
     * @param {*} object 
     */
    onObjectVisibleChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-visible-changed'
        });
    },
});
