/* eslint-disable no-unused-vars */

import XThree   from '@xthree/basic';
import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 保存选中的元素的矩阵
     * 
     * @param {*} from 
     */
    saveSelectedElementMatrix(from) {
        const coordinator        = this.coordinator;
        const selected_container = coordinator.selected_container;
        if (selected_container.empty()) {
            return;
        }

        // 统计数据
        const data = [];
        selected_container.foreach(object => {
            const item = {};
            item.object = object;
            item.matrix = new XThree.Matrix4();
            item.matrix.copy(object.compose());
            data.push(item);
        });

        /**
         * 回滚
         */
        this.append({
            coordinator,
            selected_container,
            data,

            /**
             * 回滚执行
             */
            rollback() {
                for (const item of this.data) {
                    const object = item.object;
                    object.notifyTransformWillChanged(this);
                    item.matrix.decompose(object.position, object.quaternion, object.scale);
                    object.updateWorldMatrix(true, true);
                    object.notifyTransformChanged(this);
                }
                
                this.coordinator.updateTransformer();
                this.coordinator.renderNextFrame();
            }
        });
    }
});