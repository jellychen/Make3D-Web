/* eslint-disable no-unused-vars */

import Colosseum from "./colosseum";

/**
 * 事件
 */
Object.assign(Colosseum.prototype, {
    /**
     * 
     * 滚轮事件
     * 
     * @param {*} event 
     */
    onWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0 || event.deltaX < 0) {
            this.scale *= 1.1;
        } else {
            this.scale *= 1 / 1.1;
        }
        this.colosseum_renderer.updateScale(this.scale);
        this.renderNextframe();
    }
});
