/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/huesaturation.js

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
uniform float hue;
uniform float saturation;

varying vec2 vUv;

void main() {
    vec4 color = texture(texture_data, vUv);
    float angle = hue * 3.14159265;
    float s = sin(angle), c = cos(angle);
    vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
    float len = length(color.rgb);
    color.rgb = vec3(
        dot(color.rgb, weights.xyz),
        dot(color.rgb, weights.zxy),
        dot(color.rgb, weights.yzx)
    );
    float average = (color.r + color.g + color.b) / 3.0;
    if (saturation > 0.0) {
        color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));
    } else {
        color.rgb += (average - color.rgb) * (-saturation);
    }
    gl_FragColor = color;
}`;

/**
 * 色阶饱和度
 */
export default class HueSaturation extends XThree.ShaderMaterial {
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

                hue: {
                    value: 0
                },

                saturation: {
                    value: 0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'hue-saturation';
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
     * 设置色阶 -1 - +1
     * 
     * @param {Number} value 
     */
    setHue(value) {
        this.uniforms.hue.value = value;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置饱和度 -1 - +1
     * 
     * @param {Number} value 
     */
    setSaturation(value) {
        this.uniforms.saturation.value = value;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
