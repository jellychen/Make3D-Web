/* eslint-disable no-unused-vars */

import Modifier from './modifier';

/**
 * Mixin
 */
Object.assign(Modifier.prototype, {
    /**
     * 销毁 manipulator
     */
    disposeManipulator() {
        if (this.manipulator) {
            this.manipulator.dispose();
            this.manipulator = undefined;
        }
    }
});