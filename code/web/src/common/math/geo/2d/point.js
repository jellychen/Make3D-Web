/* eslint-disable no-undef */

export default class Point {
    x = 0;
    y = 0;

    /**
     * 重置
     */
    reset() {
        this.x = 0;
        this.y = 0;
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} point 
     */
    copyFrom(point) {
        this.x = point.x;
        this.y = point.y;
    }
}
