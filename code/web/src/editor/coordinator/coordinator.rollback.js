
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 执行回撤
     */
    rollback() {
        if (this.ec && isFunction(this.ec.rollback)) {
            try {
                this.ec.rollback();
            } catch(e) {
                console.error(e);
            }
        }
    }
});
