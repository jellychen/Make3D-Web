/* eslint-disable no-unused-vars */

export default {
    /**
     * 
     * 计算一个可视的位置
     * 
     * @param {Number} float_element 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} visible_w 
     * @param {Number} visible_h 
     */
    ComputeVisiblePosition(float_element, x, y, visible_w, visible_h) {
        const client_w = float_element.clientWidth;
        const client_h = float_element.clientHeight;

        // 右下角
        if (x + client_w <= visible_w && y + client_h <= visible_h) {
            Object.assign(float_element.style, {
                left: `${x}px`,
                top:  `${y}px`,
            });
            return;
        }

        // 左下角
        if (x - client_w >= 0 && y + client_h <= visible_h) {
            Object.assign(float_element.style, {
                left: `${x - client_w}px`,
                top:  `${y}px`,
            });
            return;
        }

        // 右上角
        if (x + client_w <= visible_w && y - client_h >= 0) {
            Object.assign(float_element.style, {
                left: `${x}px`,
                top:  `${y - client_h}px`,
            });
            return;
        }

        // 左上角
        if (x - client_w >= 0 && y - client_h >= 0) {
            Object.assign(float_element.style, {
                left: `${x - client_w}px`,
                top:  `${y - client_h}px`,
            });
            return;
        }

        // 中心
        Object.assign(float_element.style, {
            left: `${x - client_w / 2}px`,
            top:  `${y - client_h / 2}px`,
        });
    }
}