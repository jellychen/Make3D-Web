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
uniform vec3 color;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    vec3 luma = vec3( 0.299, 0.587, 0.114 );
    float v = dot( texel.xyz, luma );
    gl_FragColor = vec4( v * color, texel.w );
}`;

/**
 * Colorify
 */
export default class Colorify extends XThree.ShaderMaterial {
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

                color: {
                    value: new XThree.Color(0xffffff)
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'colorify';
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
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.uniforms.color.value.setHex(color);
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
