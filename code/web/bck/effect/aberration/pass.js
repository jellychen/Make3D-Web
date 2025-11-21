/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Pass     from '../../pass';
import Material from './material';

/**
 * Pass
 */
export default class EffectPass extends Pass {
    /**
     * 构造函数
     */
    constructor() {
        super(new Material());
    }

    /**
     * 
     * @returns 
     */
    getOffsetX() {
        return this.material.uniforms.offset_x;
    }

    /**
     * 
     * @returns 
     */
    getOffsetY() {
        return this.material.uniforms.offset_y;
    }

    /**
     * 
     * 设置偏移量
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setOffset(x, y) {
        this.material.setOffset(x, y);
    }
}
