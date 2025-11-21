/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import             './object-3d.layer.highlight';
import             './object-3d.layer.editing';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 判断
     * 
     * @param {*} layer 
     * @returns 
     */
    isLayerOn(layer) {
        return this.layers.isEnabled(layer);
    },

    /**
     * 
     * 添加或者删除Layer
     * 
     * @param {*} layer 
     * @param {boolean} add_or_remove 
     * @returns 
     */
    setLayerStatus(layer, add_or_remove) {
        if (add_or_remove) {
            if (this.layers.isEnabled(layer)) {
                return false;
            } else {
                this.layers.enable(layer);
            }
        } else {
            if (!this.layers.isEnabled(layer)) {
                return false;
            } else {
                this.layers.disable(layer);
            }
        }
        return true;
    },
});
