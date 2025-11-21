/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 发送事件，变换变换
     * 
     * @param {*} reason 
     */
    notifyVisibleWillChanged(reason) {
        this.dispatchEvent({
            reason : reason,
            type   : 'visible-will-changed' 
        });

        const scene = this.getScene();
        if (scene) {
            scene.onObjectVisibleWillChanged(reason, this);
        }
    },

    /**
     * 
     * 发送事件，变换变换
     * 
     * @param {*} reason 
     */
    notifyVisibleChanged(reason) {        
        this.dispatchEvent({
            reason : reason,
            type   : 'visible-changed' 
        });

        const scene = this.getScene();
        if (scene) {
            scene.onObjectVisibleChanged(reason, this);
        }
    },
});
