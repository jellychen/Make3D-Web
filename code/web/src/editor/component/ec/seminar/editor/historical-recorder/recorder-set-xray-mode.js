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
    setXrayMode(enable) {
        this.append({
            ec : this.ec,
            enable,

            /**
             * 回撤
             */
            rollback() {
                this.ec.setSelectorSeeThrough(this.enable);
                this.ec.setter.setSelectorSeeThrough(this.enable);
            }
        })
    }
});
