/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 收到，存在灯光发生了变化
     * 
     * @param {*} reason 
     * @param {*} light 
     */
    onLightWillChanged(reason, light) {
        this.dispatchEvent({ 
            reason : reason,
            object : light,
            type   : 'light-will-changed'
        });
    },

    /**
     * 
     * 灯光发生变化
     * 
     * @param {*} reason 
     * @param {*} light 
     */
    onLightChanged(reason, light) {
        this.dispatchEvent({ 
            reason : reason,
            object : light,
            type   : 'light-changed'
        });
    },
});
