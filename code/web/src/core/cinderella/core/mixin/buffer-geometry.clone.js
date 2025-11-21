
import XThree from '@xthree/basic';

/**
 * 备份 clone
 */
const _original_clone = XThree.BufferGeometry.prototype.clone;

/**
 * Mixin
 */
Object.assign(XThree.BufferGeometry.prototype, {
    /**
     * 
     * 克隆
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        if (deep) {
            return _original_clone.call(this);
        } else {
            this.__$$_add_ref__();
            return this;
        }
    }
});
