
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 打开或者关闭自动描边
     * 
     * 描边是一个单独的Pass，理论上没有选中的元素是不需要开启这个Pass
     * 本函数就是根据是否有选中的元素进行开启或者关闭描边
     * 
     * @param {*} enable 
     * @returns 
     */
    setEnableSelectedContainerAutoOutline(enable) {
        enable = enable == true;
        if (this.selected_container_auto_outline != enable) {
            this.selected_container_auto_outline = enable;
            this.renderNextFrame();
        }
    },
});
