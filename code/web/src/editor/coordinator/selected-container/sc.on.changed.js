
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 内容发生了变化
     */
    onChanged() {
        this.coordinator.onSelectedChanged();
    }
});
