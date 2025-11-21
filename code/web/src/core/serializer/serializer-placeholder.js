/* eslint-disable no-unused-vars */

import { isUndefined } from 'lodash';
import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储 placeholder
     * 
     * @param {*} placeholder 
     * @returns 
     */
    *storePlaceholder(placeholder) {
        const object = placeholder.object;
        if (!isUndefined(object)) {
            yield* this.storeObject(object);
        }
        return this;
    },
});

