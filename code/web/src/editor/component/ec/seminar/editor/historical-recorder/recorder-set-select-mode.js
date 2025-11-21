/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 设置选择模式
     * 
     * @param {*} mode 
     */
    setSelectMode(mode) {
        this.append({
            ec : this.ec,
            mode,

            /**
             * 回撤
             */
            rollback() {
                this.ec.setupManipulatorDefault();
                this.ec.setRenderModeAndSelectorPrimitive(this.mode);
            }
        })
    }
});
