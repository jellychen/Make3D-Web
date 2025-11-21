
/**
 * 常量
 */
const COLOR_RED    = "#FF565E";
const COLOR_GREEN  = "#3ecf8e";
const COLOR_NORMAL = "#EEE";
const DASH         = [5, 5];

/**
 * 代表一个曲线
 */
export default class Curve {
    /**
     * 参数
     */
    x0     = 0;
    y0     = 0;
    x1     = 0;
    y1     = 0;
    color  = COLOR_NORMAL;
    width  = 1.6;
    
    /**
     * 虚线
     */
    enable_dash = false;

    /**
     * 重置
     */
    reset() {
        this.x0 = 0;
        this.y0 = 0;
        this.x1 = 0;
        this.y1 = 0;
    }

    /**
     * 设置普通颜色
     */
    setColorNormal() {
        this.color = COLOR_NORMAL;
    }

    /**
     * 设置红色颜色
     */
    setColorRed() {
        this.color = COLOR_RED;
    }

    /**
     * 设置绿色颜色
     */
    setColorGreen() {
        this.color = COLOR_GREEN;
    }

    /**
     * 
     * 绘制
     * 
     * @param {*} context 
     */
    draw(context) {
        if (this.x0 == this.x1 && this.y0 == this.y1) {
            return;
        } else {
            const offset = (this.x1 - this.x0) * 0.6;
            context.save();
            context.lineCap = "round";
            context.lineWidth = this.width;
            context.strokeStyle = this.color;
            context.beginPath();
            context.moveTo(this.x0, this.y0);
            context.bezierCurveTo(
                this.x0 + offset,
                this.y0,
                this.x1 - offset,
                this.y1,
                this.x1,
                this.y1);

            if (this.enable_dash) {
                context.setLineDash(DASH);
            }
            context.stroke();
            context.restore();
        }
    }
}
