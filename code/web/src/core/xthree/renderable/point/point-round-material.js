/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
uniform float pointSize;
void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = pointSize;
}`;

const shader_fs = `
uniform float pointSize;
uniform float feather;
uniform vec3 color;

void main() {
    float half_point_size = pointSize / 2.0;
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    float a = 1.0 - smoothstep((half_point_size - feather) / pointSize, 0.5, d);
    gl_FragColor = vec4(color * a, a);
    if (a <= 0.001) {
        discard;
    }
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 用来绘制圆点的材质
 */
export default class PointRoundMaterial extends XThree.ShaderMaterial {
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

                pointSize: {
                    value: 10
                },

                feather: {
                    value: 4
                },
            },
        });
        this.allowOverride = false;
        this.transparent   = true;
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
