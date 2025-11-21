/* eslint-disable no-unused-vars */

import XThree   from '@xthree/basic';
import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 保存
     * 
     * @param {*} element 
     * @param {*} from 
     */
    saveElementMatrix(element, from) {
        const coordinator = this.coordinator;
        const matrix      = new XThree.Matrix4().copy(element.compose());

        this.append({
            coordinator,
            element,
            matrix,
            
            /**
             * 回滚
             */
            rollback() {
                this.element.notifyTransformWillChanged(from);
                this.matrix.decompose(this.element.position, 
                                      this.element.quaternion, 
                                      this.element.scale);
                this.element.updateWorldMatrix(true, true);
                this.element.notifyTransformChanged(from);
                
                this.coordinator.updateTransformer();
                this.coordinator.renderNextFrame();
            }
        });
    }
});
