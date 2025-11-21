/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Scene.prototype, {
    /**
     * 
     * 通知
     * 
     * @param {*} reason 
     * @param {*} object 
     * @param {*} type 
     */
    notifer(reason, object, type) {
        this.notiferEvent({
            reason,
            object,
            type,
        });
    },

    /**
     * 
     * 通知事件
     * 
     * @param {*} event 
     */
    notiferEvent(event) {
        this.dispatchEvent(event);
    }
});
