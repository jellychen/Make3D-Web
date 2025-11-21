/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
varying vec3 vPosition;
void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const shader_fs = `
uniform vec3 color;
uniform float range_solid;
uniform float range_end;

varying vec3 vPosition;
void main() {
    float alpha = 1.0 - smoothstep(range_solid, range_end, length(vPosition));
    vec3 new_color = color * alpha;
    vec4 color_0 = vec4(new_color, alpha);
    gl_FragColor = linearToOutputTexel(color_0);
}`;

/**
 * 逐渐隐藏的颜色
 */
export default class FadeoutColor extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                range_solid: {
                    value: 1.0
                },

                range_end: {
                    value: 2.0
                },

                color: {
                    value: new XThree.Color(0xFFFFFF)
                },
            },
        });
        this.transparent        = true;
        this.polygonOffset      = true;
        this.polygonOffsetUnits = -1;
    }

    /**
     * 
     * 设置范围
     * 
     * @param {Number} solid 
     * @param {Number} end 
     * @returns
     */
    setRange(solid, end) {
        this.uniforms.range_solid.value = solid;
        this.uniforms.range_end.value   = end;
        this.needsUpdate                = true;
        return this;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     * @returns 
     */
    setColor(color) {
        this.uniforms.color.value.setHex(color);
        this.needsUpdate = true;
        return this;
    }
}
