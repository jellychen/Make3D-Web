
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 打开或者关闭
     * 
     * @param {Boolean} enable 
     */
    setEnableDevToolsPerformance(enable) {
        this.arena.setEnableDevToolsPerformance(enable);
    },

    /**
     * 
     * 打开或者关闭Console面板
     * 
     * @param {Boolean} enable 
     */
    setEnableDevToolsConsole(enable) {
        this.arena.setEnableDevToolsConsole(enable);
    },
});
