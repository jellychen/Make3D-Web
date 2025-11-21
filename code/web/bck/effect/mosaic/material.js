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
uniform float k_width;
uniform float k_height;

varying vec2 vUv;

void main() {
    vec2 texture_size  = vec2(textureSize(texture_data, 0).xy);
    vec2 texcoords_xy = vec2(vUv.x * texture_size.x, vUv.y * texture_size.y);
    float sigleMosaicX = floor(texcoords_xy.x / k_width);
    float sigleMosaicY = floor(texcoords_xy.y / k_height);
    vec2 MosaicXY = vec2(sigleMosaicX * k_width, sigleMosaicY * k_height);
    vec2 TextureForMosic = vec2(MosaicXY.x / texture_size.x, MosaicXY.y / texture_size.y);
    vec4 TextureForMosicColor = texture(texture_data, TextureForMosic);
    gl_FragColor = TextureForMosicColor;
}`;

/**
 * 矩形马赛克
 */
export default class Mosaic extends XThree.ShaderMaterial {
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

                k_width: {
                    value: 8
                },

                k_height: {
                    value: 8
                }
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'mosaic';
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
     * 设置马赛克块的尺寸
     * 
     * @param {Number} size
     */
    setMosaicSize(size) {
        this.uniforms.k_width.value = size;
        this.uniforms.k_height.value = size;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
