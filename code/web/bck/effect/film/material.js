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

uniform float intensity;
uniform bool grayscale;
uniform float time;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 base = texture2D( tDiffuse, vUv );
	float noise = rand( fract( vUv + time ) );
	vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );
	color = mix( base.rgb, color, intensity );
	if (grayscale) {
		color = vec3( luminance( color ) ); // assuming linear-srgb
	}
	gl_FragColor = vec4( color, base.a );
}`;

/**
 * 模仿电影胶片的效果
 */
export default class Film extends XThree.ShaderMaterial {
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

                time: {
                    value: 0.0,
                },

                intensity: {
                    value: 0.5,
                },

                grayscale: {
                    value: false,
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'film';
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
     * 设置时间
     * 
     * @param {Number} time 
     */
    setTime(time) {
        this.uniforms.time.value = time;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置intensity
     * 
     * @param {*} intensity 
     */
    setIntensity(intensity) {
        this.uniforms.intensity.value = intensity;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置灰度化
     * 
     * @param {Boolean} enable 
     */
    setGrayscale(enable) {
        this.uniforms.grayscale.value = true === enable;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
