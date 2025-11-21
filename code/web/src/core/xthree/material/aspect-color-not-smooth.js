/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
#include <common>

varying vec3 vViewPosition;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = mvPosition.xyz;
}`;

const shader_fs = `
#include <common>

uniform vec3 color_front;
uniform vec3 color_back;
uniform float opacity;
uniform float enhance;

varying vec3 vViewPosition;

void main() {
    vec3 n0 = normalize(-vViewPosition);    
    vec3 fdx = dFdx(-vViewPosition);
	vec3 fdy = dFdy(-vViewPosition);
    vec3 normal = normalize(cross(fdx, fdy));
    
    float c = dot(normal, n0);
    bool is_front_face = gl_FrontFacing;
    vec3 color_0 = is_front_face ? color_front : color_back;
    float factor = pow(abs(c), enhance);
    factor = min(smoothstep(0.0, 1.2, factor + 0.2), 0.8);
    vec4 out_color = vec4(color_0 * factor * opacity, opacity);
    gl_FragColor = linearToOutputTexel(out_color);
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

            uniforms: {
                enhance: { 
                    value: 2
                },
                
                color_front: {
                    value: new XThree.Color(0x646464)
                },

                color_back: {
                    value: new XThree.Color(0x282828)
                },

                opacity: {
                    value: 1.0
                }
            },
        });
        
        this.side = XThree.DoubleSide;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} side 
     */
    setSide(side) {
        if (this.side != side) {
            this.side = side;
            this.needsUpdate = true;
        }
    }

    /**
     * 
     * 设置半透明
     * 
     * @param {boolean} transparent 
     * @param {float} opacity 
     */
    setTransparent(transparent, opacity) {
        this.transparent = true === transparent;
        this.uniforms.opacity.value = parseFloat(opacity);
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置能量
     * 
     * @param {Number} enhance 
     */
    setEnhance(enhance) {
        this.uniforms.enhance.value = enhance;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置正面颜色
     * 
     * @param {*} color 
     */
    setFrontColor(color) {
        this.uniforms.color_front.value.setHex(color);
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 设置背面的颜色
     * 
     * @param {*} color 
     */
    setBackColor(color) {
        this.uniforms.color_back.value.setHex(color);
        this.needsUpdate = true;
        return this;
    }
}
