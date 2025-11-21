/* eslint-disable no-unused-vars */

import Modifier from './modifier';

/**
 * Mixin
 */
Object.assign(Modifier.prototype, {
    /**
     * 回滚
     */
    rollback() {
        // 销毁操作工具
        this.disposeManipulator();

        // 重置导航条
        this.nav_toolbar.reset();

        // 回撤
        if (this.historical_recorder && this.historical_recorder.canRollback()) {
            this.historical_recorder.rollback();
        }
    }
});