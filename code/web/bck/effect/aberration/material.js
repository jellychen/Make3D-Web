/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

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
uniform float offset_x;
uniform float offset_y;

varying vec2 vUv;

void main() {
    vec2 texture_size  = vec2(textureSize(texture_data, 0).xy);
    float _offset_x = offset_x / texture_size.x;
    float _offset_y = offset_y / texture_size.y;
    vec4 color = texture(texture_data, vUv);
    float r = texture(texture_data, vec2(vUv.x + _offset_x, vUv.y)).r;
    float b = texture(texture_data, vec2(vUv.x, vUv.y + _offset_y)).b;
    gl_FragColor = vec4(r, color.g, b, color.a);
}`;

/**
 * 颜色分层
 */
export default class Aberration extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                texture_data: {
                    value: null
                },

                offset_x: {
                    value: 0
                },

                offset_y: {
                    value: 0
                }
            },
        });
        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'aberration';
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
     * 设置偏移值
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setOffset(x, y) {
        this.uniforms.offset_x.value = x;
        this.uniforms.offset_y.value = y;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
