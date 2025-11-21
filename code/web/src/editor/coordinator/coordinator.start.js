
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 启动入口函数
     */
    start() {
        this.setEditorMode('scene');
    }
});
