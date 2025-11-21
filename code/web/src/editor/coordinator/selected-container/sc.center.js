
import XThree            from '@xthree/basic';
import SelectedContainer from './sc';

/**
 * 临时变量
 */
const VEC3_0 = new XThree.Vector3();
const VEC3_1 = new XThree.Vector3();

/**
 * Mixin
 */
Object.assign(SelectedContainer.prototype, {
    /**
     * 
     * 获取选中的中心
     * 
     * @returns 
     */
    getCenter() {
        if (0 === this.set.size) {
            VEC3_0.set(0, 0, 0);
        } else if (1 === this.set.size) {
            return this.getOneValue().getBasePoint(true);
        } else {
            VEC3_0.set(0, 0, 0);
            this.foreach(e => {
                VEC3_0.add(e.getBasePoint(true));
            });
            VEC3_0.multiplyScalar(1.0 / this.count());
        }
        return VEC3_0;
    },

    /**
     * 
     * 获取选中的中心
     * 
     * @returns 
     */
    center() {
        return this.getCenter();
    },
});
