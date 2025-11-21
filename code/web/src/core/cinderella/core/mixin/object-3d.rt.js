/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 是否是在光追中
     */
    isInRayTracer() {
        return !this.isAuxiliary();
    }
});
