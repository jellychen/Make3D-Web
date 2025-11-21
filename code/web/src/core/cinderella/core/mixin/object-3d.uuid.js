/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import XThree      from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 更新
     */
    updateUUID() {
        this.traverse(object => {
            if (!isUndefined(object.uuid)) {
                object.uuid = XThree.MathUtils.generateUUID();
            }
        }, false);
    }
});
