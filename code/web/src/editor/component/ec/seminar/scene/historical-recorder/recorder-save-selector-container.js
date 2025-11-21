/* eslint-disable no-unused-vars */

import HistoricalRecorder from './recorder';

/**
 * Mixin
 */
Object.assign(HistoricalRecorder.prototype, {
    /**
     * 保存当前的池子的选项
     */
    saveSelectorContainer() {
        const coordinator        = this.coordinator;
        const selected_container = coordinator.selected_container;

        // 统计数据
        const arr = [];
        selected_container.foreach(element => arr.push(element));

        // 添加回调
        this.append({
            coordinator,
            selected_container,
            arr,

            /**
             * 回滚
             */
            rollback() {
                if (this.selected_container.replace(this.arr)) {
                    this.coordinator.updateTransformer();
                    this.coordinator.markTreeViewNeedUpdate(false);
                    this.coordinator.renderNextFrame();
                }
            }
        });
    }
});
