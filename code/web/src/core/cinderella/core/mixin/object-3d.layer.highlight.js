/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import Layer  from './../../renderer/layer';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 判断是不是高亮
     * 
     * @returns 
     */
    isHighlight() {
        return this.isLayerOn(Layer.HIGHLIGHT);
    },

    /**
     * 
     * 设置高亮状态
     * 
     * @param {boolean} highlight 
     * @returns 
     */
    setHighlight(highlight) {
        return this.setLayerStatus(Layer.HIGHLIGHT, highlight);
    },

    /**
     * 
     * 设置自己和孩子全部的高亮状态
     * 
     * @param {*} highlight 
     * @returns 
     */
    setHighlightAllChildren(highlight) {
        let changed = false;
        this.traverse(e => {
            if (e.setHighlight(highlight)) {
                changed = true;
            }
        }, false);
        return changed;
    },
});
