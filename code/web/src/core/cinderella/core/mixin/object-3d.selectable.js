/* eslint-disable no-unused-vars */

import isUndefined from "lodash/isUndefined";
import isFunction  from "lodash/isFunction";
import XThree      from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 设置是不是可以被选中
     * 
     * @param {*} enable 
     */
    setEnableSelectable(enable) {
        this.userData.__selectable__ = !!enable;
    },

    /**
     * 判断是不是允许被选中
     */
    isSelectable() {
        if (false === this.userData.__selectable__) {
            return false;
        }

        if (isFunction(this.selectIgnore) && this.selectIgnore()) {
            return false;
        }

        if (isFunction(this.isAuxiliary) && this.isAuxiliary()) {
            return false;
        }
        
        return true;
    }
});