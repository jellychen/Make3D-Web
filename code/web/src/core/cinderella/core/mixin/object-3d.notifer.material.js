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
     * @param {*} has_textures_changed 
     */
    notifyMaterialChanged(reason, has_textures_changed = false) {
        this.dispatchEvent({ 
            reason : reason,
            type   : 'material-changed',
            has_textures_changed,
        });
            
        const scene = this.getScene();
        if (scene) {
            scene.onObjectMaterialChanged(reason, this, has_textures_changed);
        }
    },
});
