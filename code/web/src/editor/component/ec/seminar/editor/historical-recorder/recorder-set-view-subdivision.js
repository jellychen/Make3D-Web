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
     * @param {*} count 
     */
    setViewSubdivision(count) {
        this.append({
            ec : this.ec,
            count,

            /**
             * 回撤
             */
            rollback() {
                this.ec.setSubdivisionLevel(this.count);
                this.ec.setter.setViewSubdivisionLevel(this.count);
            }
        })
    }
});
