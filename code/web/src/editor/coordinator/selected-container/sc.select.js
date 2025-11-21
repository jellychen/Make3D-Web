
import isArray           from 'lodash/isArray';
import XThree            from '@xthree/basic';
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 添加一个
     * 
     * @param {Array|Object} data
     */
    select(data) {
        if (data instanceof XThree.Object3D) {
            if (data.isAuxiliary() || !data.isInScene()) {
                return false;
            }
            this.set.add(data);
            this.cinderella_outline_scene_subtree.trim();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
            return true;
        } else if (isArray(data) && data.length > 0) {
            let has_changed = false;
            for (const object of data) {
                if (!object.isAuxiliary() && object.isInScene()) {
                    has_changed = true;
                    this.set.add(object);
                }
            }

            if (!has_changed) {
                return false;
            }
            
            this.cinderella_outline_scene_subtree.trim();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
            return true;
        }
        return false;
    }
});
