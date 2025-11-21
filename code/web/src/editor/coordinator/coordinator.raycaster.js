
import Coordinator from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 
     * 获取拾取
     * 
     * @param {*} ndc_x 
     * @param {*} ndc_y 
     * @returns 
     */
    getRaycaster(ndc_x, ndc_y) {
        return this.cinderella.getRaycaster(ndc_x, ndc_y);
    }
});
