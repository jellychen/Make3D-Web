
import XThree from '@xthree/basic';

/**
 * Mixin
 */
Object.assign(XThree.Color.prototype, {
    /**
     * 
     * 判断是否是黑色
     * 
     * @returns 
     */
    isBlack() {
        return 0 == this.r && 0 == this.g && 0 == this.b;
    },

    /**
     * 
     * 判断是否非黑色
     * 
     * @returns 
     */
    isNonBlack() {
        return !this.isBlack();
    }
});
