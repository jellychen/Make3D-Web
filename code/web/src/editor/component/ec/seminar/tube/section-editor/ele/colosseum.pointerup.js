/* eslint-disable no-unused-vars */

import isInteger from "lodash/isInteger";
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
    onPointerUp(x, y) {
        this.pointerdown = false;
        if (Math.abs(this.pointerdown_x - x) > 3 ||
            Math.abs(this.pointerdown_y - y) > 3) {
            return;
        }

        //
        // 如果是细分操作
        //
        if (this.isOper_Subdivision) {
            if (!isInteger(this.selected)) {
                return;
            }
            this.section.curveCenterSubdivision(this.selected);
            this.colosseum_renderer.need_update = true;
            this.colosseum_renderer.setInteractPoint(false);
            this.colosseum_renderer.setInteractCurve(false);
            this.renderNextframe();
            this.triggerChanged();
            return;
        }

        //
        // 如果是删除操作
        //
        if (this.isOper_DeleteCurve) {
            if (!isInteger(this.selected)) {
                return;
            }

            //
            // 最少有一条曲线
            //
            if (this.section.curvesCount() < 2) {
                return;
            }

            this.section.deleteCurve(this.selected);
            this.selected = undefined;
            this.colosseum_renderer.need_update = true;
            this.colosseum_renderer.setInteractPoint(false);
            this.colosseum_renderer.setInteractCurve(false);
            this.renderNextframe();
            this.triggerChanged();
            return;
        }
    }
});
