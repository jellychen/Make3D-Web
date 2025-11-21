/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/vignette.js

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
uniform float size;
uniform float amount;

varying vec2 vUv;

void main() {
    vec4 color = texture(texture_data, vUv);
    float dist = distance(vUv, vec2(0.5, 0.5));
    color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));
    gl_FragColor = color;
}`;

/**
 * 用来镜头边缘黑色的效果
 */
export default class Vignette extends XThree.ShaderMaterial {
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
                    value: 0.5
                },

                size: {
                    value: 0.5
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'vignette';
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
     * 设置量
     * 
     * @param {*} amount 
     */
    setAmount(amount = 0.5) {
        this.uniforms.amount.value = amount;
        this.needsUpdate = true;
    }

    /**
     * 
     * 显示尺寸
     * 
     * @param {*} size 
     */
    setSize(size = 0.5) {
        this.uniforms.size.value = size;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
