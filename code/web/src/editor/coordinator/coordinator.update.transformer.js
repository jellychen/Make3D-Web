
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 更新变换器
     * 
     * @param {*} now 
     * @returns 
     */
    updateTransformer(now = false) {
        if (now) {
            //
            // 如果变换器更新被截断了
            //
            let truncate = false;
            if (isFunction(this.transformer_updater_hook)) {
                truncate = this.transformer_updater_hook();
            }
            
            //
            // 如果Hook函数返回真，就被截断
            //
            if (!truncate) {
                this.transformer_updater.update();
            }

            this.transformer_need_update = false;
        } else {
            this.transformer_need_update = true;
        }
    }
});
