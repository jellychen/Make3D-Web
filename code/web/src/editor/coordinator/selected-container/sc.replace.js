
import isArray           from 'lodash/isArray';
import XThree            from '@xthree/basic';
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 替换
     * 
     * @param {Array|Object} data 
     */
    replace(data) {
        if (data instanceof XThree.Object3D) {
            this.set.clear();
            if (!data.isAuxiliary() && data.isInScene()) {
                this.set.add(data);
            }
            this.cinderella_outline_scene_subtree.trim();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
            return true;
        } else if (isArray(data) && data.length > 0) {
            this.set.clear();
            for (const object of data) {
                if (!(object instanceof XThree.Object3D)) {
                    continue;
                }

                if (!object.isAuxiliary() && object.isInScene()) {
                    this.set.add(object);
                }
            }
            this.cinderella_outline_scene_subtree.trim();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
            return true;
        } else {
            this.set.clear();
            this.cinderella_outline_scene_subtree.trim();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
            return true;
        }
    }
});
