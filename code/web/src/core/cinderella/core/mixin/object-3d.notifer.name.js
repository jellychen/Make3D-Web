/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 发送事件
     * 
     * @param {string} reason 
     */
    notifyNameWillChanged(reason) {
        this.dispatchEvent({ 
            reason : reason,
            type   : 'name-will-changed'
        });

        const scene = this.getScene();
        if (scene) {
            scene.onObjectNameWillChanged(reason, this);
        }
    },

    /**
     * 
     * 发送事件
     * 
     * @param {string} reason 
     */
    notifyNameChanged(reason) {        
        this.dispatchEvent({ 
            reason : reason,
            type   : 'name-changed'
        });

        const scene = this.getScene();
        if (scene) {
            scene.onObjectNameChanged(reason, this);
        }
    },
});
