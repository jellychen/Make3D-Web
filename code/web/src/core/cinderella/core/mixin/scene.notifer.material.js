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
     * @param {*} has_textures_changed 
     */
    onObjectMaterialChanged(reason, object, has_textures_changed) {
        this.dispatchEvent({ 
            reason: reason,
            object: object,
            type  : 'child-material-changed',
            has_textures_changed,
        });
    },
});
