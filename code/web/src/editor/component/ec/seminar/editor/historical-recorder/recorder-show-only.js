/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 设置
     * 
     * @param {*} show 
     */
    showOnly(show) {
        this.append({
            ec : this.ec,
            show,

            /**
             * 回撤
             */
            rollback() {
                this.ec.setShowOnly(this.show);
                this.ec.setter.setShowOnly(this.show);
            }
        })
    }
});
