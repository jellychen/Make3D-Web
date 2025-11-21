
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 获取全部的元素
     * 
     * @returns 
     */
    all() {
        return this.cinderella_outline_scene_subtree.arr;
    }
});
