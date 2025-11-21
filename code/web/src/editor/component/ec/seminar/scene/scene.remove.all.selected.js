/* eslint-disable no-unused-vars */

import Scene from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 移除全部的选中的元素
     */
    removeAllSelectedObjects() {
        if (this.selector && this.selector.removeAllSelectedObjects()) {
            this.coordinator.markTreeViewNeedUpdate(true);
        }
    }
});
