/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 是否是外部导入
     * 
     * @returns 
     */
    isExternalImport() {
        return !!this.userData.__external_import__;
    },

    /**
     * 
     * 标记是不是外部导入
     * 
     * @param {boolean} value 
     */
    markExternalImport(value) {
        this.traverse(e => {
            e.userData.__external_import__ = value;
        }, true);
    },
});
