
import isFunction  from 'lodash/isFunction';
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 帧开始
     */
    onFrameBegin() {
        //
        // 先更新选择器
        //
        if (this.selected_container_need_update) {
            this.selected_container_need_update = false;
            if (this.selected_container.checkIfSomethingDeleted()) {
                this.transformer_need_update = true;
            }
        }

        //
        // 再更新变换器
        //
        if (this.transformer_need_update) {
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
        }
    },

    /**
     * 帧结束
     */
    onFrameEnd() {
        ;
    },
});
