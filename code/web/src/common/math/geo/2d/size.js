/* eslint-disable no-undef */

export default class Size {
    w = 0;
    h = 0;

    /**
     * 重置
     */
    reset() {
        this.w = 0;
        this.h = 0;
    }

    /**
     * 
     * 拷贝
     * 
     * @param {*} size 
     */
    copyFrom(size) {
        this.w = size.w;
        this.h = size.h;
    }
}