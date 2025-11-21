
import isFunction        from 'lodash/isFunction';
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 遍历处理每一个
     * 
     * @param {Function} callback 
     */
    foreach(callback) {
        if (!isFunction(callback)) {
            return;
        }
        this.cinderella_outline_scene_subtree.trimIfNeed();
        this.set.forEach(callback);
    },

    /**
     * 
     * 遍历处理每一个
     * 
     * @param {Function} callback 
     */
    foreachAll(callback) {
        if (!isFunction(callback)) {
            return;
        }
        
        this.cinderella_outline_scene_subtree.trimIfNeed();
        for (const value of this.set) {
            value.traverse(e => {
                try {
                    callback(e);
                } catch (e) {
                    console.error(e);
                }
            }, false);
        }
    },
});
