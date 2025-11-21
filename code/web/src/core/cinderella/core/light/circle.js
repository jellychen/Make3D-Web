
import XThreeRenderable from '@xthree/renderable';

/**
 * 圆环
 */
export default class CircleLineSegments extends XThreeRenderable.LineSegments {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 显示参数
     * 
     * @param {*} r 
     * @param {*} segments_count 
     */
    setRadius(r, segments_count) {
        const circle = [];
        for (let i = 0; i <= segments_count; ++i) {
            const length = circle.length;
            if (length > 0 && length % 6 == 0) {
                const x = circle[length - 3];
                const y = circle[length - 2];
                const z = circle[length - 1];
                circle.push(x, y, z);
            }
            const angle = i * Math.PI * 2.0 / segments_count;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            circle.push(x, y, 0);
        }
        this.setSegments(circle);
    }
}
