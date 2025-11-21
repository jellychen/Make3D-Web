
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 获取当前的内容的数量
     * 
     * @returns 
     */
    count() {
        return this.cinderella_outline_scene_subtree.size();
    }
});
