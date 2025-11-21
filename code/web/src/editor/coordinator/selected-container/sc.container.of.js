
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 判断是否在子树中
     * 
     * @param {*} object 
     * @returns 
     */
    containerOf(object) {
        return this.cinderella_outline_scene_subtree.containerOf(object);
    }
});
