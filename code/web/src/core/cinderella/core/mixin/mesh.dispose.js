/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * 备份 dispose
 */
const _original_dispose = XThree.Mesh.prototype.dispose;

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 
     * 丢弃BVH包围盒
     * 
     * @returns 
     */
    disposeBoundsTree() {
        if (!this.geometry) {
            return false;
        }
        
        if (isFunction(this.geometry.disposeBoundsTree)) {
            this.geometry.disposeBoundsTree();
        }
    },

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

        if (isFunction(_original_dispose)) {
            _original_dispose.call(this);
        }
        
        return this;
    },
});
