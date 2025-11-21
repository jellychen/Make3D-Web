
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 更新
     * 
     * @param {*} now 
     */
    updateSelectedContainerIfHasSomethingDelete(now) {
        if (now) {
            this.selected_container_need_update = false;
            if (this.selected_container.checkIfSomethingDeleted()) {
                this.transformer_need_update = true;
            }
        } else {
            this.selected_container_need_update = true;
        }
    },
});
