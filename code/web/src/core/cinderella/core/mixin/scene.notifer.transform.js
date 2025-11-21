/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 接收到，有元素矩阵变化了
     * 
     * @param {string} reason 
     * @param {*} object 
     */
    onObjectTransformWillChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-transform-will-changed'
        });
    },

    /**
     * 
     * 接收到，有元素矩阵变化了
     * 
     * @param {string} reason 
     * @param {*} object 
     */
    onObjectTransformChanged(reason, object) {
        this.dispatchEvent({ 
            reason : reason,
            object : object,
            type   : 'child-transform-changed'
        });
    },
});
