
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 出发事件
     * 
     * @param {*} key 
     * @param {*} value 
     */
    triggerNotify(key, value = {}) {
        this.dispatchEvent(key, value);
    },

    /**
     * 通知选择集变化了
     */
    notifySelectedContainerChanged() {
        this.dispatchEvent("selected.changed", {});
    },
});
