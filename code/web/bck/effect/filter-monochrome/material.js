/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://blog.csdn.net/hahahhahahahha123456/article/details/104722525
// 单色

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
    vec4 new_color = vec4(0, 0, 0, color.a);

#ifdef R
#if R
    new_color.r = color.r;
#endif
#endif

#ifdef G
#if G
    new_color.g = color.g;
#endif
#endif

#ifdef B
#if B
    new_color.b = color.b;
#endif
#endif

    gl_FragColor = new_color;
}`;

/**
 * 单色
 */
export default class Monochrome extends XThree.ShaderMaterial {
    /**
     * 
     */
    #channel = 'red';

    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,

            defines: {
                R: 1,
                G: 1,
                B: 1,
            },
            
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
        this.type = 'filter-monochrome';
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
     * 设置单色通道
     * 
     * @param {string} channel 
     */
    setChannel(channel) {
        let channel_lowercase = channel.toLocaleLowerCase();
        if (this.#channel === channel_lowercase) {
            return;
        }

        this.defines.R = 0;
        this.defines.G = 0;
        this.defines.B = 0;

        if ('red' === channel_lowercase) {
            this.defines.R = 1;
        } else if ('green' === channel_lowercase) {
            this.defines.G = 1;
        } else if ('blue' === channel_lowercase) {
            this.defines.B = 1;
        }

        this.#channel = channel_lowercase;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
