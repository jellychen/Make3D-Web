
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 检测目前已经被选中的元素，是不是已经被删除了
     * 
     * @returns 
     */
    checkIfSomethingDeleted() {
        return this.cinderella_outline_scene_subtree.update(); 
    }
});
