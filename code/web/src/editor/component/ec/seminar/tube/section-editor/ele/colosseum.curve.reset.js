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
        const curve = this.section;
        curve.clear();

        // 画一个圆
        const r = 50;
        const k = 0.552284749831; // 贝塞尔逼近圆的常量
        const c = r * k;

        curve.moveTo(r, 0);
        curve.bezierTo(r, -c, c, -r, 0, -r);
        curve.bezierTo(-c, -r, -r, -c, -r, 0);
        curve.bezierTo(-r, c, -c, r, 0, r);
        curve.close(c, r, r, c); 

        this.colosseum_renderer.need_update = true;
        this.renderNextframe();
        this.triggerChanged();
    }
});
