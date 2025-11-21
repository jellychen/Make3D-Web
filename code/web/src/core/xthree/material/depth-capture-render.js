/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

const shader_vs = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const shader_fs = `
void main() {
    gl_FragColor = vec4(1.0);
}`;

/**
 * 获取深度
 */
export default class Depth extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,
            side          : XThree.DoubleSide,
            depthTest     : true,
            depthWrite    : true,
            polygonOffset : true,
        });
    }

    /**
     * 
     * 设置
     * 
     * @param {Number} factor 
     * @param {Number} units 
     */
    setPolygonOffset(factor, units) {
        if (factor === this.polygonOffsetFactor &&
            units  === this.polygonOffsetUnits) {
            return;
        }
        this.needsUpdate         = true;
        this.polygonOffsetFactor = factor;
        this.polygonOffsetUnits  = units ;
    }
}
