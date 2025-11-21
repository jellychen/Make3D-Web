/* eslint-disable no-unused-vars */

import isArray  from 'lodash/isArray';
import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 会删除这些
     * 
     * @param {*} objects 
     */
    deleteObjects(objects) {
        if (!isArray(objects) || objects.length == 0) {
            return;
        }

        const coordinator = this.coordinator;
        const scene       = this.scene;
        const set         = new Set(objects);

        /**
         * 添加回滚操作
         */
        this.append({
            coordinator,
            scene,
            set,
            
            /**
             * 回滚
             */
            rollback() {                
                for (const object of this.set) {
                    object.removeFromParent();
                    object.dispose();
                }
                
                this.coordinator.updateTransformer();
                this.coordinator.markTreeViewNeedUpdate(true);
                this.coordinator.renderNextFrame();
            }
        });

    }
});
