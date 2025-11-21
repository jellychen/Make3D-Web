/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 删除元素
     */
    deleteObject(object) {
        if (!object) {
            return;
        }

        this.append({
            scene      : this.scene,
            coordinator: this.coordinator,
            object,

            /**
             * 回滚
             */
            rollback() {
                this.object.removeFromParent();
                this.object.dispose(true, true);

                this.coordinator.updateTransformer();
                this.coordinator.markTreeViewNeedUpdate(true);
                this.coordinator.renderNextFrame();
            }
        });
    }
});
