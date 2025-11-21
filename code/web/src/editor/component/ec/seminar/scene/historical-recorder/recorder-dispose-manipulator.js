/* eslint-disable no-unused-vars */

import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 销毁交互
     */
    disposeManipulator() {
        this.append({
            ec : this.ec,
            
            rollback() {
                this.ec.assistor.disposeManipulator();
                this.ec.nav_toolbar.resetSwitcherSelectedStatus();
            }
        });
    }
});
