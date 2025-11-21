/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 设置模式
     * 
     * @param {*} mode 
     */
    setBooleanMode(mode) {
        this.append({
            ec: this.ec,
            mode,

            /**
             * 回滚
             */
            rollback() {
                this.ec.setBooleanType(this.mode);
                this.ec.toolbar.select(this.mode);
            }
        });
    }
});
