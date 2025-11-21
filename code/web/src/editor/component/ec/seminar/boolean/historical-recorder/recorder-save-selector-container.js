/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 保存当前的池子的选项
     */
    saveSelectorContainer() {
        const coordinator        = this.coordinator;
        const selected_container = coordinator.selected_container;

        // 统计数据
        const data = [];
        selected_container.foreach(element => {
            data.push(element);
        });

        /**
         * 回滚
         */
        this.append({
            coordinator,
            selected_container,
            data,

            /**
             * 回滚执行
             */
            rollback() {
                this.selected_container.replace(this.data);
                this.coordinator.updateTransformer();
            }
        });
    }
});
