/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `

attribute float pointHighlight;

uniform float pointSize;

varying float vPointHighlight;

void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = pointSize;
    vPointHighlight = pointHighlight;
}`;

const shader_fs = `

uniform float pointSize;
uniform float feather;
uniform vec3 color_0;
uniform vec3 color_1;

varying float vPointHighlight;

void main() {
    float half_point_size = pointSize / 2.0;
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    float a = 1.0 - smoothstep((half_point_size - feather) / pointSize, 0.5, d);

    if (vPointHighlight < 0.001) {
        gl_FragColor = vec4(color_0 * a, a);
    } else {
        gl_FragColor = vec4(color_1 * a, a);
    }

    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 用来绘制圆点的材质
 */
export default class PointMaterial extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                color_0: {
                    value: new XThree.Color(0xff0000)
                },

                color_1: {
                    value: new XThree.Color(0x00ffff)
                },

                pointSize: {
                    value: 10
                },

                feather: {
                    value: 4
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

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setPointSize(size) {
        this.uniforms.pointSize.value = size;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置外部羽化
     * 
     * @param {Number} feather 
     */
    setFeather(feather) {
        this.uniforms.feather.value = feather;
        this.needsUpdate = true;
    }
}
