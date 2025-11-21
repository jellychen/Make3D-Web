
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.cinderella_outline_scene_subtree.size() == 0;
    }
});
