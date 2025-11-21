
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 显示 Toasts
     * 
     * @param {*} token 
     * @param {*} defer_dismiss_timeout 
     */
    showToasts(token, defer_dismiss_timeout) {
        if (this.arena) {
            this.arena.showToasts(token, defer_dismiss_timeout);
        }
    }
});
