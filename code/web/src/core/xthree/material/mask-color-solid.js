/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const shader_fs = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

/**
 * 用来编辑时使用
 */
export default class Material extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,
            side          : XThree.DoubleSide,
            depthTest     : false,
            depthWrite    : false,
        });
    }
}
