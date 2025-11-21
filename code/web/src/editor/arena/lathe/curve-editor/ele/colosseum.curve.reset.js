/* eslint-disable no-unused-vars */

import Colosseum from "./colosseum";

/**
 * 曲线重置
 */
Object.assign(Colosseum.prototype, {
    /**
     * 重置曲线
     */
    curveReset() {
        const curve = this.curve;
        curve.clear();
        curve.moveTo  (0 ,  60);
        curve.bezierTo(60,  60, 
                       60, -60, 
                       0 , -60);
        this.colosseum_renderer.need_update = true;
        this.renderNextframe();
        this.triggerChanged();
    }
});
