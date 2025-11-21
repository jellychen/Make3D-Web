/* eslint-disable no-unused-vars */

import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储元
     * 
     * 魔法数： 0527
     * 
     * @param {*} version_h 
     * @param {*} version_l 
     * @returns 
     */
    storeMetadata(version_h = 0, version_l = 0) {
        this.append_Byte(9);
        this.append_Byte(5);
        this.append_Byte(2);
        this.append_Byte(7);
        this.append_I32 (version_h);
        this.append_I32 (version_l);
        return this;
    },
});
