
import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * 备份 dispose
 */
const _original_dispose = XThree.Material.prototype.dispose;

/**
 * Mixin
 */
Object.assign(XThree.Material.prototype, {
    /**
     * 释放
     */
    dispose() {
        //
        // 先释放纹理
        //
        for (const key in this) {
            if (this[key] instanceof XThree.Texture) {
                this[key].__$$_del_ref__();
            }
        }

        //
        // 再调用材质的销毁
        //
        if (isFunction(_original_dispose)) {
            _original_dispose.call(this);
        }
    },
});
