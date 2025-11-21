/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/brightnesscontrast.js

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
uniform float brightness;
uniform float contrast;

varying vec2 vUv;

void main() {
    vec4 color = texture(texture_data, vUv);
    color.rgb += brightness;
    if (contrast > 0.0) {
        color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
    } else {
        color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
    }
    gl_FragColor = color;
}`;

/**
 * 亮度对比对
 */
export default class BrightnessContrast extends XThree.ShaderMaterial {
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

                brightness: {
                    value: 0,
                },

                contrast: {
                    value: 0,
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'brightness-contrast';
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
     * 设置亮度
     * 
     * @param {Number} brightness 
     */
    setBrightness(brightness) {
        this.uniforms.brightness.value = brightness;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置对比度
     * 
     * @param {Number} contrast 
     */
    setContrast(contrast) {
        this.uniforms.contrast.value = contrast;
        this.needsUpdate = true;
    }
    
    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
