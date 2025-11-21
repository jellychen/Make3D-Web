/* eslint-disable no-unused-vars */

import Mat4            from '@common/math/mat4';
import SphericalCamera from '@common/math/spherical-camera';
import Vec3            from '@common/math/vec3';

/**
 * 默认值
 */
const circle_solid_radius   = 9.0;
const circle_outline_radius = 7.0;
const circle_outline_width  = 2.0;
const color_x               = '#FE5B5D';
const color_y               = '#36E2B3';
const color_z               = '#239CFF';
const color_gray            = '#919191';
const color_text            = '#FFFFFF';

/**
 * Gizmo 用来做小的坐标指示器
 */
export default class Gizmo {
    /**
     * 标记是否在等待下一帧渲染
     */
    #is_waiting_next_frame = false;

    /**
     * 用来渲染
     */
    #canvas;
    #canvas_context;

    /**
     * 球形相机
     */
    #spherical_camera = new SphericalCamera();

    /**
     * 临时变量
     */
    #mat4_view;
    #mat4_perspective = new Mat4();
    #mat4_vp = new Mat4();

    /**
     * 尺寸
     */
    #w;
    #h;

    /**
     * 临时变量
     */
    #arr = [];

    /**
     * 
     * 构造函数
     * 
     * @param {*} canvas 
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#canvas_context = this.#canvas.getContext('2d');
        this.#canvas_context.lineCap = "round";
        this.#mat4_perspective.perspective(45, 1, 0.1, 100);
        this.#spherical_camera.setRadius(3.5);
        this.#arr.push({ l: -1, p: new Vec3() }); // -x
        this.#arr.push({ l: +1, p: new Vec3() }); // +x
        this.#arr.push({ l: -2, p: new Vec3() }); // -y
        this.#arr.push({ l: +2, p: new Vec3() }); // +y
        this.#arr.push({ l: -3, p: new Vec3() }); // -z
        this.#arr.push({ l: +3, p: new Vec3() }); // +z
        this.setView(Math.D2A_(-100), Math.D2A_(75));
        this.adaptDPR();
    }

    /**
     * 适配高清屏的模糊
     */
    adaptDPR() {
        const dpr = window.devicePixelRatio || 1.0;
        let w = this.#canvas.width;
        let h = this.#canvas.height;
        this.#canvas.width  = Math.round(w * dpr);
        this.#canvas.height = Math.round(h * dpr);
        this.#canvas.style.width  = w + 'px';
        this.#canvas.style.height = h + 'px';
        this.#canvas_context.scale(dpr, dpr);
        this.#w = w;
        this.#h = h;
    }

    /**
     * 
     * 设置球形视角
     * 
     * @param {*} mat4 
     */
    setView(a, b) {
        this.#spherical_camera.a = a;
        this.#spherical_camera.b = b;
        this.#mat4_view = this.#spherical_camera.getViewMat4();
        this.#mat4_perspective.copy(this.#mat4_vp);
        this.#mat4_vp.postMultiply(this.#mat4_view);
        this.requestAnimationFrame();
    }

    /**
     * 对位置信息进行整理
     */
    sorted() {
        for (let item of this.#arr) {
            // -x
            if (-1 == item.l) {
                item.p.set(-1, +0, +0);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }

            // +x
            else if (+1 == item.l) {
                item.p.set(+1, +0, +0);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }

            // -y
            else if (-2 == item.l) {
                item.p.set(+0, -1, +0);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }

            // +y
            else if (+2 == item.l) {
                item.p.set(+0, +1, +0);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }

            // -z
            else if (-3 == item.l) {
                item.p.set(+0, +0, -1);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }

            // +z
            else if (+3 == item.l) {
                item.p.set(+0, +0, +1);
                item.p.transform(this.#mat4_vp);
                item.p.x = (1.0 + item.p.x) / 2.0 * this.#w;
                item.p.y = (1.0 - item.p.y) / 2.0 * this.#h;
            }
        }

        // 按照z轴顺序进行排序
        this.#arr.sort((a, b) => { return b.p.z - a.p.z; });
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} timestamp
     */
    #onDraw() {
        if (this.#w <= 0 || this.#h <= 0) {
            return;
        }

        this.sorted();
        let context = this.#canvas_context;
        context.font = context.font.replace(/(?<value>\d+\.?\d*)/, 10);
        context.clearRect(0, 0, this.#w, this.#h);
        for (let item of this.#arr) {
            this.#drawItem(item)
        }
    }

    /**
     * 
     * 绘制其中一项
     * 
     * @param {*} item 
     */
    #drawItem(item) {
        const center_x = this.#w / 2;
        const center_y = this.#h / 2;
        const x = item.p.x;
        const y = item.p.y;
        const line_start_x = (center_x + x) / 2.0;
        const line_start_y = (center_y + y) / 2.0;

        // -x
        if (-1 == item.l) {
            this.#drawCircleOutline(x, y, circle_outline_radius, circle_outline_width, color_x);
            this.#drawLine(line_start_x, line_start_y, center_x, center_y, 2, color_x);
        }

        // +x
        else if (+1 == item.l) {
            this.#drawCircle(x, y, circle_solid_radius, color_x);
            this.#drawLine(x, y, center_x, center_y, 2, color_x);
            this.#drawText(x, y, 'X', color_text);
        }

        // -y
        else if (-2 == item.l) {
            this.#drawCircleOutline(x, y, circle_outline_radius, circle_outline_width, color_y);
            this.#drawLine(line_start_x, line_start_y, center_x, center_y, 2, color_y);
        }

        // +y
        else if (+2 == item.l) {
            this.#drawCircle(x, y, circle_solid_radius, color_y);
            this.#drawLine(x, y, center_x, center_y, 2, color_y);
            this.#drawText(x, y, 'Y', color_text);
        }

        // -z
        else if (-3 == item.l) {
            this.#drawCircleOutline(x, y, circle_outline_radius, circle_outline_width, color_z);
            this.#drawLine(line_start_x, line_start_y, center_x, center_y, 2, color_z);
        }

        // +z
        else if (+3 == item.l) {
            this.#drawCircle(x, y, circle_solid_radius, color_z);
            this.#drawLine(x, y, center_x, center_y, 2, color_z);
            this.#drawText(x, y, 'Z', color_text);
        }
    }

    /**
     * 
     * 绘制有颜色的圆圈
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} r 
     * @param {Number} color 
     */
    #drawCircle(x, y, r, color) {
        this.#canvas_context.fillStyle = color;
        this.#canvas_context.beginPath();
        this.#canvas_context.arc(x, y, r, 0, 2 * Math.PI);
        this.#canvas_context.fill();
    }

    /**
     * 
     * 绘制有颜色的圆圈外围
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} r 
     * @param {Number} w 
     * @param {Number} color 
     */
    #drawCircleOutline(x, y, r, w, color) {
        this.#canvas_context.strokeStyle = color;
        this.#canvas_context.lineWidth = w;
        this.#canvas_context.beginPath();
        this.#canvas_context.arc(x, y, r, 0, 2 * Math.PI);
        this.#canvas_context.stroke();
    }

    /**
     * 
     * 绘制有颜色的直线
     * 
     * @param {Number} x0 
     * @param {Number} y0 
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} w 
     * @param {Number} color 
     */
    #drawLine(x0, y0, x1, y1, w, color) {
        this.#canvas_context.strokeStyle = color;
        this.#canvas_context.lineWidth = w;
        this.#canvas_context.beginPath();
        this.#canvas_context.moveTo(x0, y0);
        this.#canvas_context.lineTo(x1, y1);
        this.#canvas_context.stroke();
    }

    /**
     * 
     * 绘制文字，中心点在 X, Y
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} str 
     * @param {*} color 
     */
    #drawText(x, y, str, color) {
        const m = this.#canvas_context.measureText(str);
        const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        const draw_x = x - m.width / 2.0;
        const draw_y = y - h / 2.0 + m.actualBoundingBoxAscent;
        this.#canvas_context.beginPath();
        this.#canvas_context.fillStyle = color;
        this.#canvas_context.fillText(str, draw_x, draw_y);
    }

    /**
     * 再下一帧执行渲染
     */
    requestAnimationFrame() {
        if (this.#w <= 0 || this.#h <= 0) {
            return;
        }

        if (this.#is_waiting_next_frame) {
            return;
        }
        
        requestAnimationFrame(timestamp => {
            this.#is_waiting_next_frame = false;
            this.#onDraw(timestamp);
        });
        this.#is_waiting_next_frame = true;
    }
}
