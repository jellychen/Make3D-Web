
import isArray           from 'lodash/isArray';
import XThree            from '@xthree/basic';
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 移除一批
     * 
     * @param {Array|Object} data 
     */
    unselect(data) {
        if (data instanceof XThree.Object3D) {
            if (data.isAuxiliary() || !data.isInScene()) {
                return false;
            }

            if (this.set.has(data)) {
                this.set.delete(data);
                this.cinderella_outline_scene_subtree.trim();
                this.coordinator.notifySelectedContainerChanged();
                this.onChanged();
            }
            return true;
        } else if (isArray(data) && data.length > 0) {
            let has_changed = false;
            for (const object of data) {
                if (object.isAuxiliary() || !object.isInScene()) {
                    continue;
                }

                if (this.set.has(data)) {
                    this.set.delete(object);
                    has_changed = true;
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
