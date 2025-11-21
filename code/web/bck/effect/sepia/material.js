/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/sepia.js
// 怀旧

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
uniform float amount;

varying vec2 vUv;

void main() {
    vec4 color = texture(texture_data, vUv);
    float r = color.r;
    float g = color.g;
    float b = color.b;
    color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));
    color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));
    color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));
    gl_FragColor = color;
}`;

/**
 * 怀旧
 */
export default class Sepia extends XThree.ShaderMaterial {
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

                amount: {
                    value: 0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'sepia';
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
     * 设置量能 0 - 1
     * 
     * @param {Number} amount 
     */
    setAmount(amount) {
        this.uniforms.amount.value = amount;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
