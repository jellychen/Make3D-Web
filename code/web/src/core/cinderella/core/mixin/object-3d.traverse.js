/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 遍历全部的元素
     * 
     * @param {*} callback 
     * @param {*} all 
     */
    traverse(callback, all = false) {
        if (!all && this.userData.__is_auxiliary__) {
            return;
        }

        callback(this);

        for (const child of this.children) {
            child.traverse(callback, all);
        }
    },

    /**
     * 
     * 遍历全部的元素，可以中断
     * 
     * @param {*} callback 
     */
    traverseInterrupt(callback) {
        if (!callback(this)) {
            return;
        }

        for (const child of this.children) {
            child.traverseInterrupt(callback);
        }
    },
});
