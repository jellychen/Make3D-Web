/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `

uniform vec3 color_0;
uniform vec3 color_1;
uniform float opacity_0;
uniform float opacity_1;

attribute float pointHighlight;

varying vec3 vColor;
varying float vOpacity;

void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    vColor   = pointHighlight * color_1   + (1.0 - pointHighlight) * color_0;
    vOpacity = pointHighlight * opacity_1 + (1.0 - pointHighlight) * opacity_0;
}`;

const shader_fs = `

varying vec3 vColor;
varying float vOpacity;

void main() {
    gl_FragColor = vec4(vColor * vOpacity, vOpacity);
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 用来绘制渐变的线段的材质
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
                color_0: {
                    value: new XThree.Color(0x0)
                },

                color_1: {
                    value: new XThree.Color(0xffffff)
                },

                opacity_1: { // 高亮的透明度
                    value: 0.9
                },

                opacity_0: {
                    value: 0.7
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
        this.uniforms.color_0.value.setHex(color);
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置高亮颜色
     * 
     * @param {*} color 
     */
    setColorHighlight(color) {
        this.uniforms.color_1.value.setHex(color);
        this.needsUpdate = true;
    }
}
