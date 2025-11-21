/* eslint-disable no-unused-vars */

import Clone    from 'lodash/clone';
import Recorder from './recorder';

/**
 * Mixin
 */
Object.assign(Recorder.prototype, {
    /**
     * 
     * 恢复删除的元素
     * 
     * @param {*} from 
     */
    recoverDeletedElements(from) {
        const coordinator        = this.coordinator;
        const scene              = this.scene;
        const selected_container = coordinator.selected_container;

        // 统计数据
        const arr_0 = [];
        const arr_1 = [];
        selected_container.foreach(object => {
            if (!object.parent) {
                return;
                
            }

            arr_0.push(object);
            
            const item = {};
            item.object = object;
            item.parent = object.parent;
            item.parent_children = Clone(item.parent.children);
            arr_1.push(item);
        });

        // 添加回调
        this.append({
            coordinator,
            scene,
            selected_container,
            arr_0,
            arr_1,

            rollback() {
                for (const item of this.arr_1) {
                    item.object.parent = item.parent;
                    item.parent.children = item.parent_children;
                }
                this.selected_container.replace(this.arr_0);
                this.coordinator.updateTransformer();
                this.coordinator.markTreeViewNeedUpdate(true);
                this.coordinator.renderNextFrame();
            },

            destroy() {
                for (const object of this.arr_0) {
                    object.dispose();
                }
            }
        });
    }
});