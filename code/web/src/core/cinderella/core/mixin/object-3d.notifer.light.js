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
     * @param {*} reason 
     */
    notifyLightWillChanged(reason) {
        this.dispatchEvent({ 
            reason : reason,
            type   : 'light-will-changed' 
        });

        const scene = this.getScene();
        if (scene) {
            scene.onLightWillChanged(reason, this);
        }
    },

    /**
     * 
     * 发送事件
     * 
     * @param {*} reason 
     */
    notifyLightChanged(reason) {        
        this.dispatchEvent({ 
            reason : reason,
            type   : 'light-changed' 
        });
            
        const scene = this.getScene();
        if (scene) {
            scene.onLightChanged(reason, this);
        }
    },
});
