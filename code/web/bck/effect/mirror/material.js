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

// side of input to mirror (0 = left, 1 = right, 2 = top, 3 = bottom)
uniform int side;

varying vec2 vUv;

void main() {
    vec2 p = vUv;
    if (side == 0) {
        if (p.x > 0.5) p.x = 1.0 - p.x;
    }else if (side == 1) {
        if (p.x < 0.5) p.x = 1.0 - p.x;
    }else if (side == 2) {
        if (p.y < 0.5) p.y = 1.0 - p.y;
    }else if (side == 3) {
        if (p.y > 0.5) p.y = 1.0 - p.y;
    }
    vec4 color = texture2D(tDiffuse, p);
    gl_FragColor = color;
}`;

/**
 * 镜像
 */
export default class Mirror extends XThree.ShaderMaterial {
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

                side: {
                    value: 1
                }
            }
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'mirror';
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
     * 设置镜像
     * 
     * @param {string} side 
     */
    setSide(side) {
        const side_lowercase = side.toLocaleLowerCase();
        if ('left' === side) {
            this.uniforms.side.value = 0;
            this.needsUpdate = true;
        } else if ('right' === side) {
            this.uniforms.side.value = 1;
            this.needsUpdate = true;
        } else if ('top' === side) {
            this.uniforms.side.value = 2;
            this.needsUpdate = true;
        } else if ('bottom' === side) {
            this.uniforms.side.value = 3;
            this.needsUpdate = true;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
