/* eslint-disable no-unused-vars */

import Scene from './scene';

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 回滚
     */
    rollback() {
        // 如果打开了设置器先关闭设置器，
        if (this.assistor.hasCurrentManipulator() && 
            this.assistor.resetManipulatorToDefault()) {
            return;
        }

        // 执行真实的回滚
        if (this.historical_recorder && this.historical_recorder.canRollback()) {
            this.historical_recorder.rollback();
            return;
        }
    }
});
