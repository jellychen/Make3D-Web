
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 重置nav的选择
     */
    resetNavToolbar() {
        const nav = this.nav;
        if (!nav) {
            return;
        }

        const toolbar = nav.getToolbarContent();
        if (toolbar && isFunction(toolbar.reset)) {
            toolbar.reset();
        }
    },
});
