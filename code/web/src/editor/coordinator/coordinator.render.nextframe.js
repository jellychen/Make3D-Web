
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        if (this.selected_container_auto_outline) {
            if (this.selected_container.empty()) {
                this.cinderella_conf_context.setEnableOutline(false);
            } else {
                this.cinderella_conf_context.setEnableOutline(true);
            }
        }
        this.cinderella.requestAnimationFrame();
    }
});
