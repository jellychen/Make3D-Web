/* eslint-disable no-undef */

/**
 * 可以渲染的基类
 */
export default class Base {
    /**
     * 可视
     */
    visible = true;

    /**
     * 缩放
     */
    scale = 1.0;

    /**
     * 
     * 绘制
     * 
     * @param {*} renderer 
     */
    draw(renderer) {
        if (this.visible) {
            const dc = renderer.dc;
            dc.save();
            this.onRender(renderer);
            dc.restore();
        }
    }

    /**
     * 
     * 留给子类重写
     * 
     * @param {*} renderer 
     */
    onRender(renderer) {
        ;
    }
}