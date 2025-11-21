/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 延迟执行
     * 
     * @param {*} callback 
     * @param {*} timeout_ms 
     */
    deferInvoke(callback, timeout_ms = 0) {
        if (isFunction(callback)) {
            const ref = this.getWeakRef();
            return setTimeout(() => {
                const object = ref.deref();
                if (object) {
                    try {
                        callback(ref.deref());
                    } catch (e) {
                        console.error(e);
                    }
                }
            }, timeout_ms);
        }
    }
});
