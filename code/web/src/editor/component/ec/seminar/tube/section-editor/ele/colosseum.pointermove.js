/* eslint-disable no-unused-vars */

import isInteger from "lodash/isInteger";
import Curve     from '@core/curves/curve-2d';
import Colosseum from "./colosseum";

/**
 * 临时对象
 */
const curve_0 = new Curve();

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
    onPointerMove(x, y) {
        const curve = this.section;

        //
        // 鼠标没有按下
        //
        if (!this.pointerdown) {

            //
            // 操作曲线
            //
            if (this.isOper_Curve) {
                if (this.colosseum_renderer.setInteractPoint(false)) {
                    this.renderNextframe();
                }
                
                const index = curve.hittestCurve(x, y, 4 / this.scale);
                if (!isInteger(index)) {
                    if (this.colosseum_renderer.setInteractPoint(false)) {
                        this.renderNextframe();
                    }

                    if (this.colosseum_renderer.setInteractCurve(false)) {
                        this.renderNextframe();
                    }
                    this.selected = undefined;
                } else {
                    if (this.colosseum_renderer.setInteractCurve(true, index)) {
                        this.renderNextframe();
                    }

                    this.selected = index;

                    // 如果是中间细分，还要把中间的点给补偿进去
                    if (this.isOper_Subdivision) {
                        curve.getCurve(index, curve_0);
                        const center = curve_0.get(0.5);
                        const x = center.x;
                        const y = center.y;
                        if (this.colosseum_renderer.setInteractPoint(true, x, y)) {
                            this.renderNextframe();
                        }
                    }
                }
            }
            
            //
            // 操作点
            //
            else {
                const index = curve.hittest(x, y, 5 / this.scale);
                if (!isInteger(index)) {
                    if (this.colosseum_renderer.setInteractPoint(false)) {
                        this.renderNextframe();
                    }
                    this.selected = undefined;
                } else {
                    const point = curve.getPoint(index);
                    const x = point.x;
                    const y = point.y;
                    if (this.colosseum_renderer.setInteractPoint(true, x, y)) {
                        this.renderNextframe();
                    }
                    this.selected = index;
                }
            }
        } 
        
        //
        // 鼠标已经按下
        //
        else {
            const offset_x = x - this.pointer_current_x;
            const offset_y = y - this.pointer_current_y;
            if (offset_x == 0 && offset_y == 0) {
                return;
            }

            //
            // 操作曲线
            //
            if (this.isOper_SelectCurve) {
                if (isInteger(this.selected)) {
                    curve.offsetCurve(this.selected, offset_x, offset_y);
                    this.colosseum_renderer.need_update = true;
                    this.renderNextframe();
                    this.triggerChanged();
                }
            }

            //
            // 操作点
            //
            else if (this.isOper_SelectPoint) {
                if (isInteger(this.selected)) {
                    const curve_points_len = curve.points.length;
                    curve.offsetPoint(this.selected, offset_x, offset_y);
                    const point = curve.getPoint(this.selected);

                    //
                    // 如果是端点还要把 上下的控制点一并移动
                    //
                    if (!point.controller) {
                        if (this.selected > 0) {
                            curve.offsetPoint(this.selected -1, offset_x, offset_y);
                        }

                        if (this.selected < curve_points_len -1) {
                            curve.offsetPoint(this.selected +1, offset_x, offset_y);
                        }
                    }

                    const x = point.x;
                    const y = point.y;
                    this.colosseum_renderer.setInteractPoint(true, x, y);
                    this.colosseum_renderer.need_update = true;
                    this.renderNextframe();
                    this.triggerChanged();
                }
            }
        }

        // 记录位置
        this.pointer_current_x = x;
        this.pointer_current_y = y;
    }
});
