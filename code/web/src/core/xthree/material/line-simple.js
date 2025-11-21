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
uniform vec3 color;
uniform float opacity;
void main() {
    gl_FragColor = vec4(color * opacity, opacity);
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 用来绘制线段
 */
export default class LineMaterial extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                color: {
                    value: new XThree.Color(0xffffff)
                },

                opacity: {
                    value: 1.0
                },
            },
        });
        this.transparent = true;
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.uniforms.color.value.setHex(color);
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置透明度
     * 
     * @param {*} opacity 
     */
    setOpacity(opacity) {
        this.uniforms.opacity.value = opacity;
        this.needsUpdate = true;
    }
}
