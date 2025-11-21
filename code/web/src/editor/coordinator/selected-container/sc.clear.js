
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 清空全部的
     */
    clear() {
        if (!this.empty()) {
            this.set.clear();
            this.coordinator.notifySelectedContainerChanged();
            this.onChanged();
        }
        return true;
    }
});
