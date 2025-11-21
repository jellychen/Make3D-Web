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
#include <common>
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    float l = luminance( texel.rgb );
    gl_FragColor = vec4( l, l, l, texel.w );
}`;

/**
 * 亮度
 */
export default class Luminosity extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                tDiffuse: {
                    value: null,
                },
            }
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'luminosity';
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
     * 设置纹理
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
