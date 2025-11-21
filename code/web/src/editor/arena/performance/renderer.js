/* eslint-disable no-unused-vars */

/**
 * 关键变量定义
 */
const max_record_count = 24;
const color_info       = '#48FF9C';
const color_warn       = '#FF3D48';

/**
 * 绘制FPS的趋势图
 */
export default class Renderer {
    /**
     * Dom
     */
    #html_canvas;

    /**
     * 只存储 max_record_count 个数
     */
    #data = new Array();

    /**
     * 绘制
     */
    #dc;
    #dc_scale = 0.0;
    #dc_fill_gradient_info;
    #dc_fill_gradient_warn;

    /**
     * 渲染
     */
    #is_waitting_render = false;
    
    /**
     * 
     * 构造函数
     * 
     * @param {*} html_canvas 
     */
    constructor(html_canvas) {
        this.#html_canvas = html_canvas;
        this.#dc = this.#html_canvas.getContext("2d");
        for (let i = 0; i < max_record_count; ++i) {
            this.#data.push(0);
        }
    }

    /**
     * 
     * 添加新的
     * 
     * @param {Number} data 
     */
    push(data) {
        this.#data.shift();
        this.#data.push(data);
        this.#requestAnimationFrame();
    }

    /**
     * 执行绘制操作
     */
    draw() {
        this.#is_waitting_render = false;

        // 调整
        const ratio = window.devicePixelRatio || 1;
        let w = this.#html_canvas.offsetWidth;
        let h = this.#html_canvas.offsetHeight;
        if (this.#dc_scale != ratio) {
            this.#html_canvas.width = ratio * w;
            this.#html_canvas.height = ratio * h;
            this.#html_canvas.style.width  = "${w}px";
            this.#html_canvas.style.height = "${h}px";
            this.#dc.reset();
            this.#dc.scale(ratio, ratio);
            this.#dc_scale = ratio;
        }

        // 统计最大值
        // let max = 0;
        // for (let i = 0; i < max_record_count; ++i) {
        //     let v = this.#data[i];
        //     if (v > max) {
        //         max = v;
        //     }
        // }
        let max = 120;

        // 清空屏幕
        this.#dc.clearRect(0, 0, w, h);

        // 宽度细分
        let path_is_start = false;
        let step = w / max_record_count + 1;

        // 如果当前的FPS低于30FPS
        let warn = this.#data[this.#data.length - 1] < 30;

        // 绘制
        this.#dc.beginPath();
        this.#dc.moveTo(0, h);
        for (let i = 0; i < max_record_count; ++i) {
            let v = this.#data[i];
            v = v / max * h;
            let x = step * i;
            let y = h - v;
            this.#dc.lineTo(x, y);
        }
        this.#dc.lineTo(w, h);
        this.#dc.closePath();

        // 如果当前的FPS低于20FPS
        if (warn) {
            if (!this.#dc_fill_gradient_warn) {
                let gradient = this.#dc.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, color_warn);
                gradient.addColorStop(1, 'transparent');
                this.#dc_fill_gradient_warn = gradient;
            }
            this.#dc.fillStyle = this.#dc_fill_gradient_warn;
        } else {
            if (!this.#dc_fill_gradient_info) {
                let gradient = this.#dc.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, color_info);
                gradient.addColorStop(1, 'transparent');
                this.#dc_fill_gradient_info = gradient;
            }
            this.#dc.fillStyle = this.#dc_fill_gradient_info;
        }
        this.#dc.fill();

        // 绘制折线图
        this.#dc.beginPath();
        for (let i = 0; i < max_record_count; ++i) {
            let v = this.#data[i];
            v = v / max * h;
            let x = step * i;
            let y = h - v;
            if (!path_is_start) {
                this.#dc.moveTo(x, y);
                path_is_start = true;
            } else {
                this.#dc.lineTo(x, y);
            }
        }

        // 如果当前的FPS低于20FPS
        if (warn) {
            this.#dc.strokeStyle = color_warn;
        } else {
            this.#dc.strokeStyle = color_info;
        }

        this.#dc.lineWidth = 1;
        this.#dc.stroke();
    }

    /**
     * 请求下一帧渲染
     */
    #requestAnimationFrame() {
        if (this.#is_waitting_render) {
            return;
        }
        requestAnimationFrame(()=>this.draw());
    }
}
