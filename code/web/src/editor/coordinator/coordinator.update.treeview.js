
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 更新场景的树控件，显示新的数据
     * 
     * @param {*} scene_change 
     * @returns 
     */
    markTreeViewNeedUpdate(scene_change = false) {
        if (this.moderator) {
            this.moderator.markNeedUpdateTree(scene_change);
        }
    }
});
