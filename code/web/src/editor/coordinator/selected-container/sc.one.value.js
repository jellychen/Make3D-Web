
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 获取一个值
     * 
     * @returns 
     */
    getOneValue() {
        this.cinderella_outline_scene_subtree.trimIfNeed();
        if (this.set.size > 0) {
            return this.set.values().next().value;
        }
    }
});
