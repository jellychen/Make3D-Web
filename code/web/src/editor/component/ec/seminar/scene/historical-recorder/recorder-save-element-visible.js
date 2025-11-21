/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 保存
     * 
     * @param {*} element 
     * @param {*} from 
     */
    saveElementVisible(element, from) {
        const coordinator = this.coordinator;
        const visible     = element.visible;

        // 添加回调
        this.append({
            coordinator,
            element,
            visible,

            /**
             * 回滚
             */
            rollback() {
                this.element.notifyVisibleWillChanged(from);
                this.element.visible = this.visible;
                this.element.notifyVisibleChanged(from);
                
                this.coordinator.updateTransformer();
                this.coordinator.markTreeViewNeedUpdate(false);
                this.coordinator.renderNextFrame();
            }
        });
    }
});