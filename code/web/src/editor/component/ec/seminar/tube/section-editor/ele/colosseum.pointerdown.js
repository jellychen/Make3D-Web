/* eslint-disable no-unused-vars */

import Colosseum from "./colosseum";

/**
 * 事件
 */
Object.assign(Colosseum.prototype, {
    /**
     * 
     * 事件
     * 
     * @param {*} x 
     * @param {*} y 
     */
    onPointerDown(x, y) {
        this.pointerdown       = true;
        this.pointer_current_x = x;
        this.pointer_current_y = y;
        this.pointerdown_x     = x;
        this.pointerdown_y     = y;
    }
});
