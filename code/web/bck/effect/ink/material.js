/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://github.com/evanw/glfx.js/blob/master/src/filters/fun/ink.js

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
uniform float strength;

varying vec2 vUv;

void main() {
    vec2 texture_size  = vec2(textureSize(texture_data, 0).xy);
    vec2 dx = vec2(1.0 / texture_size.x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / texture_size.y);
    vec4 color = texture(texture_data, vUv);
    float bigTotal = 0.0;
    float smallTotal = 0.0;
    vec3 bigAverage = vec3(0.0);
    vec3 smallAverage = vec3(0.0);
    for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
            vec3 _sample = texture(texture_data, vUv + dx * x + dy * y).rgb;
            bigAverage += _sample;
            bigTotal += 1.0;
            if (abs(x) + abs(y) < 2.0) {
                smallAverage += _sample;
                smallTotal += 1.0;
            }
        }
    }
    vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);
    gl_FragColor = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);
}`;

/**
 * 用来模拟降噪
 */
export default class Ink extends XThree.ShaderMaterial {
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

                strength: {
                    value: 0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'ink';
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
     * 0 到 任意
     * 
     * @param {Number} strength 
     */
    setStrength(strength) {
        this.uniforms.strength.value = strength;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
