
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 选择的元素发生了更新
     */
    onSelectedChanged() {
        const supervisor = this.cinderella.getLightSupervisor();
        const associate_container = supervisor.getAssociateContainer();
        associate_container.onSelectedChange(this.selected_container);
    }
});
