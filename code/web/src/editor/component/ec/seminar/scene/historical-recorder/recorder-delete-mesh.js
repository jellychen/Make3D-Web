/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 删除元素
     */
    deleteMesh(mesh) {
        this.deleteObject(mesh);
    }
});