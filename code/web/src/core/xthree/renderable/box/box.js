/* eslint-disable no-unused-vars */

import LineSegments from '../line/line-segments';

/**
 * 绘制包围盒
 */
export default class Box extends LineSegments {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 设置Box
     * 
     * @param {*} box 
     */
    setBox(box) {
        /*
              5____4
            1/___0/|
             | 6__|_7
            2/___3/

            0: max.x, max.y, max.z
            1: min.x, max.y, max.z
            2: min.x, min.y, max.z
            3: max.x, min.y, max.z
            4: max.x, max.y, min.z
            5: min.x, max.y, min.z
            6: min.x, min.y, min.z
            7: max.x, min.y, min.z
        */

        let min = box.min;
        let max = box.max;
        let segments = [];
        segments.push(max.x, max.y, max.z, min.x, max.y, max.z); // 0 - 1
        segments.push(max.x, max.y, max.z, max.x, max.y, min.z); // 0 - 4
        segments.push(max.x, max.y, max.z, max.x, min.y, max.z); // 0 - 3
        segments.push(min.x, max.y, max.z, min.x, max.y, min.z); // 1 - 5
        segments.push(min.x, max.y, max.z, min.x, min.y, max.z); // 1 - 2
        segments.push(min.x, min.y, max.z, max.x, min.y, max.z); // 2 - 3
        segments.push(min.x, min.y, max.z, min.x, min.y, min.z); // 2 - 6
        segments.push(max.x, min.y, max.z, max.x, min.y, min.z); // 3 - 7
        segments.push(max.x, max.y, min.z, min.x, max.y, min.z); // 4 - 5
        segments.push(max.x, max.y, min.z, max.x, min.y, min.z); // 4 - 7
        segments.push(min.x, max.y, min.z, min.x, min.y, min.z); // 5 - 6
        segments.push(min.x, min.y, min.z, max.x, min.y, min.z); // 6 - 7

        this.setSegments(segments);

        return this;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
