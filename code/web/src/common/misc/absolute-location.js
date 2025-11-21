/* eslint-disable no-unused-vars */

/**
 * 绝对定位
 */
export default class AbsoluteLocation {
    /**
     * 
     * 左上
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static LeftTop(target, container, margin_x = 0, margin_y = 0) {
        target.style.left = `${margin_x}px`;
        target.style.top  = `${margin_y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**6
     * 
     * 上左
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static TopLeft(target, container, margin_x = 0, margin_y = 0) {
        AbsoluteLocation.LeftTop(target, container, margin_x, margin_y);
    }

    /**
     * 
     * 中上
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_y 
     */
    static CenterTop(target, container, margin_y = 0) {
        const parent_w    = container.offsetWidth;
        const w           = target.offsetWidth;
        const x           = (parent_w - w) / 2.0;
        target.style.left = `${x}px`;
        target.style.top  = `${margin_y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 上中
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_y 
     */
    static TopCenter(target, container, margin_y = 0) {
        AbsoluteLocation.CenterTop(target, container, margin_y);
    }

    /**
     * 
     * 右上
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static RightTop(target, container, margin_x = 0, margin_y = 0) {
        const parent_w    = container.offsetWidth;
        const w           = target.offsetWidth;
        const x           = parent_w - w - margin_x;
        target.style.left = `${x}px`;
        target.style.top  = `${margin_y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 上右
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static TopRight(target, container, margin_x = 0, margin_y = 0) {
        AbsoluteLocation.TopRight(target, container, margin_x, margin_y);
    }

    /**
     * 
     * 左中
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     */
    static LeftCenter(target, container, margin_x = 0) {
        const parent_w    = container.offsetWidth;
        const parent_h    = container.offsetHeight;
        const w           = target.offsetWidth;
        const h           = target.offsetHeight;
        const y           = (parent_h - h) / 2.0;
        target.style.left = `${margin_x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 正中
     * 
     * @param {*} target 
     * @param {*} container 
     */
    static Center(target, container) {
        const parent_w    = container.offsetWidth;
        const parent_h    = container.offsetHeight;
        const w           = target.offsetWidth;
        const h           = target.offsetHeight;
        const x           = (parent_w - w) / 2.0;
        const y           = (parent_h - h) / 2.0;
        target.style.left = `${x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 右中
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     */
    static RightCenter(target, container, margin_x = 0) {
        const parent_w    = container.offsetWidth;
        const parent_h    = container.offsetHeight;
        const w           = target.offsetWidth;
        const h           = target.offsetHeight;
        const x           = parent_w - w - margin_x;
        const y           = (parent_h - h) / 2.0;
        target.style.left = `${x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 左下
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static LeftBottom(target, container, margin_x = 0, margin_y = 0) {
        const parent_h    = container.offsetHeight;
        const h           = target.offsetHeight;
        const y           = parent_h - h - margin_y;
        target.style.left = `${margin_x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 下左
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static BottomLeft(target, container, margin_x = 0, margin_y = 0) {
        AbsoluteLocation.LeftBottom(target, container, margin_x, margin_y);
    }

    /**
     * 
     * 中下
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_y 
     */
    static CenterBottom(target, container, margin_y = 0) {
        const parent_w    = container.offsetWidth;
        const parent_h    = container.offsetHeight;
        const w           = target.offsetWidth;
        const h           = target.offsetHeight;
        const x           = (parent_w - w) / 2.0;
        const y           = parent_h - h - margin_y;
        target.style.left = `${x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 下中
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_y 
     */
    static BottomCenter(target, container, margin_y = 0) {
        AbsoluteLocation.CenterBottom(target, container, margin_y);
    }

    /**
     * 
     * 右下
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static RightBottom(target, container, margin_x = 0, margin_y = 0) {
        const parent_w    = container.offsetWidth;
        const parent_h    = container.offsetHeight;
        const w           = target.offsetWidth;
        const h           = target.offsetHeight;
        const x           = parent_w - w - margin_x;
        const y           = parent_h - h - margin_y;
        target.style.left = `${x}px`;
        target.style.top  = `${y}px`;
        target.style.removeProperty('right');
        target.style.removeProperty('bottom');
    }

    /**
     * 
     * 下右
     * 
     * @param {*} target 
     * @param {*} container 
     * @param {Number} margin_x 
     * @param {Number} margin_y 
     */
    static BottomRight(target, container, margin_x = 0, margin_y = 0) {
        AbsoluteLocation.RightBottom(target, container, margin_x, margin_y);
    }
}
