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
#define ITERATIONS 10.0
uniform sampler2D texture_data;
uniform vec2 delta;

varying vec2 vUv;

void main() {
    vec4 color = vec4( 0.0 );
    float total = 0.0;

    // randomize the lookup values to hide the fixed number of samples
    float offset = rand( vUv );

    for (float t = -ITERATIONS; t <= ITERATIONS; t++) {
        float percent = ( t + offset - 0.5 ) / ITERATIONS;
        float weight = 1.0 - abs( percent );
        color += texture( texture_data, vUv + delta * percent ) * weight;
        total += weight;
    }
    gl_FragColor = color / total;
}`;

/**
 * 模糊
 */
export default class Triangle extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                texture_data: {
                    value: null,
                },

                delta: {
                    value: new XThree.Vector2(1, 1)
                },
            },
        });
        
        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'blur-triangle';
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
        this.uniforms.texture_data.value = texture;
        this.needsUpdate = true;
    }

    /**
     * 
     * 模糊参数
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setDelta(x, y) {
        this.uniforms.delta.value.x = x;
        this.uniforms.delta.value.y = y;
        this.needsUpdate = true;
    }
    
    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
