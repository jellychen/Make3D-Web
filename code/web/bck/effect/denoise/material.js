/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/denoise.js

import XThree from '@xthree/basic';

/**
 * shader
 */
const shader_vs = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`;

const shader_fs = `
uniform sampler2D texture_data;
uniform float exponent;

varying vec2 vUv;

void main() {
    vec2 texture_size  = vec2(textureSize(texture_data, 0).xy);
    vec4 center = texture(texture_data, vUv);
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float x = -4.0; x <= 4.0; x += 1.0) {
        for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec4 _sample = texture(texture_data, vUv + vec2(x, y) / texture_size);
            float weight = 1.0 - abs(dot(_sample.rgb - center.rgb, vec3(0.25)));
            weight = pow(weight, exponent);
            color += _sample * weight;
            total += weight;
        }
    }
    gl_FragColor = color / total;
}`;

/**
 * 用来模拟降噪
 */
export default class Denoise extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                texture_data: {
                    value: null,
                },

                exponent: {
                    value: 0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'denoise';
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) { }

    /**
     * 
     * 设置要处理的图
     * 
     * @param {*} texture 
     */
    setTexture(texture) {
        this.uniforms.texture_data.value = texture;
        this.needsUpdate = true;
    }

    /**
     * 
     * 0 - 50
     * 
     * @param {Number} exponent 
     */
    setExponent(exponent) {
        this.uniforms.exponent.value = exponent;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
