/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://blog.csdn.net/hahahhahahahha123456/article/details/104722525
// 褐色

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
precision highp float;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    float r = color.r;
    float g = color.g;
    float b = color.b;
    float a = color.a;
    float new_r = r * 0.393 + g * 0.769 + b * 0.189;
    float new_g = r * 0.349 + g * 0.686 + b * 0.168;
    float new_b = r * 0.272 + g * 0.534 + b * 0.131;
    gl_FragColor = vec4(new_r, new_g, new_b, a);
}`;

/**
 * 褐色
 */
export default class Brown extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                tDiffuse: {
                    value: null
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'filter-brown';
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
        this.uniforms.tDiffuse.value = texture;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}