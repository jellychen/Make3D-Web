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
uniform sampler2D tDiffuse;
uniform vec3 powRGB;
uniform vec3 mulRGB;
uniform vec3 addRGB;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D( tDiffuse, vUv );
    gl_FragColor.rgb = mulRGB * pow( ( gl_FragColor.rgb + addRGB ), powRGB );
}`;

/**
 * ColorCorrection
 */
export default class ColorCorrection extends XThree.ShaderMaterial {
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

                powRGB: {
                    value: new XThree.Color(2, 2, 2)
                },

                mulRGB: {
                    value: new XThree.Color(1, 1, 1)
                },

                addRGB: {
                    value: new XThree.Color(0, 0, 0)
                }
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'color-correction';
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
     * powRGB
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setPowRGB(r, g, b) {
        this.uniforms.powRGB.set(r, g, b);
        this.needsUpdate = true;
    }

    /**
     * 
     * mulRGB
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setMulRGB(r, g, b) {
        this.uniforms.mulRGB.set(r, g, b);
        this.needsUpdate = true;
    }

    /**
     * 
     * addRGB
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setAddRGB(r, g, b) {
        this.uniforms.addRGB.set(r, g, b);
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
