/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * key
 */
const KEY_COLOR     = 'color';    // 颜色
const KEY_FRESNEL_E = 'exponent'; // 指数 默认是 1

/**
 * shader
 */
const shader_vs = `
#include <common>

varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
}`;

const shader_fs = `
#include <common>

uniform vec3 color_front;
uniform vec3 color_back;
uniform float opacity;
uniform float enhance;
uniform float high_contrast;

varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
    vec3 n0 = normalize(-vViewPosition);
    vec3 normal = vNormal;        
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

                high_contrast: { 
                    value: 0.0
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
        return this;
    }

    /**
     * 
     * 设置是否开启高对比度
     * 
     * @param {boolean} enable 
     */
    setEnableHighContrast(enable) {
        if (enable) {
            this.uniforms.high_contrast.value = 1.0;
        } else {
            this.uniforms.high_contrast.value = 0.0;
        }
        this.needsUpdate = true;
        return this;
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

    /**
     * 
     * 设置数据
     * 
     * @param {*} data 
     * @param {Function} request_next_frame 
     */
    setData(data, request_next_frame = undefined) {
        /**
         * color
         */
        if (KEY_COLOR in data) {
            this.setColor(data[KEY_COLOR]);
        }

        /**
         * exponent
         */
        if (KEY_FRESNEL_E in data) {
            this.setExponent(Number(data[KEY_FRESNEL_E]));
        }

        return this;
    }
}
