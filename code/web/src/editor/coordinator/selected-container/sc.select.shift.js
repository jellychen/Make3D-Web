
import isArray           from 'lodash/isArray';
import XThree            from '@xthree/basic';
import SelectedContainer from './sc';

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 选择
     * 
     * @param {Array|Object} data
     * @param {boolean} shift 
     */
    selectShift(data = undefined, shift = false) {
        //
        // 如果没有按下shift按键
        //
        if (!shift) {
            if (data instanceof XThree.Object3D) {
                return this.replace(data);
            } else if (isArray(data) && data.length > 0) {
                return this.replace(data);
            } else {
                return this.clear();
            }
        } 
        
        //
        // 如果按下了shift按键, 执行反选逻辑
        //
        else if (data instanceof XThree.Object3D) {
            if (!this.containerOf(data)) {
                return this.select(data);
            } else {
                return this.unselect(data);
            }
        } 
        
        //
        // 如果按下了shift按键
        //
        else if (isArray(data) && data.length > 0) {
            return this.select(data);
        }

        return false;
    }
});
