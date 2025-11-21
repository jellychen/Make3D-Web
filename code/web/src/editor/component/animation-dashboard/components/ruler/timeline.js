/* eslint-disable no-unused-vars */

/**
 * 定义
 */
const color_text    = '#D3D3D3';
const color_segment = '#D3D3D3';

/**
 * 绘制标尺
 */
export default class Timeline {
    /**
     * 尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} w 
     * @param {*} h 
     */
    constructor(w, h) {
        this.resize(w, h);
    }

    /**
     * 
     * 重置尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     */
    resize(w, h) {
        this.#w = w;
        this.#h = h;
    }

    /**
     * 
     * 以指定位置为中心，绘制文字
     * 
     * @param {*} context 
     * @param {*} time 
     * @param {*} x 
     * @param {*} y 
     * @param {*} color 
     */
    #drawTimeText(context, time, x, y, color) {
        const str = `${time}s`;
        const m = context.measureText(str);
        const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        const draw_x = x - m.width / 2.0;
        const draw_y = y - h / 2.0 + m.actualBoundingBoxAscent;
        context.beginPath();
        context.fillStyle = color;
        context.fillText(str, draw_x, draw_y);
    }

    /**
     * 
     * 执行绘制
     * 
     * @param {*} offset_time 
     * @param {*} span 
     * @param {*} context 
     */
    draw(offset_time, span, context) {
        context.save();

        const t = Math.floor(offset_time);
        const s = (t - offset_time) * span;

        // 设置尺寸
        const match = /(?<value>\d+\.?\d*)/;
        context.font = context.font.replace(match, 8);

        // 先绘制线段
        {
            context.beginPath();
            context.strokeStyle = color_segment;
            context.lineWidth = 1;
            let current = s;
            let current_is_second = true;
            for (;;) {
                if (current_is_second) {
                    context.moveTo(current, 0);
                    context.lineTo(current, 6);
                } else {
                    context.moveTo(current, 0);
                    context.lineTo(current, 3);
                }

                current_is_second = !current_is_second;
                current += span * 0.5;
                if (current > this.#w) {
                    break;
                }
            }
            context.stroke();
        }

        // 绘制字体
        {
            let current   = t;
            let current_x = s;
            for (;;) {
                this.#drawTimeText(context, 
                                   current, 
                                   current_x, 
                                   16, 
                                   color_text);
                current   += 1;
                current_x += span;
                if (current_x > this.#w) {
                    break;
                }
            }

        }

        context.restore();
    }
}
