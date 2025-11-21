/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Layer  from './../../renderer/layer';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 是否在编辑
     * 
     * @returns 
     */
    isEditing() {
        return this.isLayerOn(Layer.EDITING);
    },

    /**
     * 
     * 设置编辑状态
     * 
     * @param {*} editing 
     * @returns 
     */
    setEditing(editing) {
        return this.setLayerStatus(Layer.EDITING, editing);
    },
});
