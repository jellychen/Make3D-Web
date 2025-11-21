/* eslint-disable no-unused-vars */

import Scene from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 移除
     */
    disposeManipulator() {
        if (this.assistor) {
            this.assistor.disposeManipulator();
        }
    }
});
