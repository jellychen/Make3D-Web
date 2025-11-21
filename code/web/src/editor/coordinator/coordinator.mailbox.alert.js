
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 消息提示
     * 
     * @param {Boolean} top_or_bottom 
     * @param {string} type 
     * @param {string} text 
     * @param {Number} defer_close_time 
     */
    mailboxAlert(top_or_bottom, type, text, defer_close_time = 3000) {
        if (top_or_bottom) {
            this.mailbox_t.postMessage({
                type,
                text,
                defer_close_time,
            });
        } else {
            this.mailbox_b.postMessage({
                type,
                text,
                defer_close_time,
            });
        }
    }
});
