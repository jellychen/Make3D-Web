/* eslint-disable no-unused-vars */

import isArray  from 'lodash/isArray';
import clone    from 'lodash/clone';
import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 重置
     * 
     * @param {*} objects 
     * @returns 
     */
    resetReceptacleObjects(objects) {
        if (!isArray(objects)) {
            return;
        }

        /**
         * 回滚
         */
        this.append({
            ec     : this.ec,
            objects: clone(objects),

            // 回滚
            rollback() {
                this.ec.receptacle.resetAllObjets(this.objects);
                this.ec.updateAndMarkNeedUpdate();
            }
        });
    }
});