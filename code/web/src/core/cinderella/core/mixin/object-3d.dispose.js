/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 销毁自己和孩子
     */
    disposeAndAllChildren() {
        this.traverse(e => {
            if (isFunction(e.dispose)) {
                try {
                    e.dispose();
                } catch (e) {
                    console.error(e);
                }
            }
        }, true);
    }
});
