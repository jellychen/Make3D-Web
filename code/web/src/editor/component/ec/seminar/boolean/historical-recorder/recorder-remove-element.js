/* eslint-disable no-unused-vars */

import isFunction from 'lodash';
import Recorder   from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 移除指定的元素
     * 
     * @param {*} element 
     * @param {*} from 
     */
    removeElement(element, from) {
        this.append({
            coordinator: this.coordinator,
            scene      : this.scene,
            ec         : this.ec,
            element,

            /**
             * 回滚
             */
            rollback() {
                this.scene.onWillRemove(this, this.element);
                this.element.removeFromParent();
                if (isFunction(element.dispose)) {
                    element.dispose(true, true);
                }
                this.scene.onRemoved(this, this.element);
                this.scene.onChanged(this);
                this.coordinator.renderNextFrame();
                this.coordinator.updateTransformer();
            }
        })
    }
});
