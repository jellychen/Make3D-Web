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
uniform float exposure;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D( tDiffuse, vUv );
    gl_FragColor.rgb *= exposure;
}`;

/**
 * 调整曝光值
 */
export default class Exposure extends XThree.ShaderMaterial {
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

                exposure: {
                    value: 1.0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'exposure';
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
     * 
     * 设置曝光值
     * 
     * @param {Number} exposure 
     */
    setExposure(exposure) {
        this.uniforms.exposure.value = exposure;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
