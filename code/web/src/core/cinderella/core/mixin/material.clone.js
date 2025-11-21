
import XThree from '@xthree/basic';

/**
 * 备份 clone
 */
const _original_clone = XThree.Material.prototype.clone;

/**
 * Mixin
 */
Object.assign(XThree.Material.prototype, {
    /**
     * 
     * 克隆
     * 
     * @param {*} deep 
     * @returns 
     */
    clone(deep = true) {
        if (deep) {
            const cloned = _original_clone.call(this);
            if (!cloned) {
                return;
            }

            for (const key in cloned) {
                if (cloned[key] instanceof XThree.Texture) {
                    cloned[key].__$$_add_ref__();
                }
            }
            return cloned;
        } else {
            this.__$$_add_ref__();
            return this;
        }
    },
});
