/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 
 * Mixin
 * 
 * 用来表示是不是辅助的对象
 * 
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 标记是不是辅助对象
     * 
     * @param {*} mark 
     */
    setMarkAuxiliary(mark) {
        mark = true == mark;
        this.traverse(e => e.userData.__is_auxiliary__ = mark, true);
    },

    /**
     * 
     * 判断是不是辅助对象
     * 
     * @returns 
     */
    isAuxiliary() {
        return this.userData.__is_auxiliary__;
    },
});
