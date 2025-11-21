/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Points.prototype, {
    /**
     * 只销毁几何
     */
    disposeGeo() {
        if (this.geometry) {
            this.geometry.__$$_del_ref__();
            this.geometry = undefined;
        }
    },

    /**
     * 只释放材质
     */
    disposeMaterial() {
        if (this.material) {
            this.material.__$$_del_ref__();
            this.material = undefined;
        }
    },

    /**
     * 
     * 销毁
     * 
     * @param {*} geo 
     * @param {*} material 
     * @returns 
     */
    dispose(geo = true, material = true) {
        if (geo) {
            this.disposeGeo();
        }

        if (material) {
            this.disposeMaterial();
        }
        return this;
    },
});
