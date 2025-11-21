/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// https://www.shadertoy.com/view/XlXcW4

import XThree from '@xthree/basic';

/**
 * shader
 */
const shader_vs = `
void main() {
    gl_Position = vec4(position, 1.0);
}`;

const shader_fs = `
const uint k = 1103515245U;
uniform int random;

vec3 hash(uvec3 x) {
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    x = ((x>>8U)^x.yzx)*k;
    return vec3(x)*(1.0 / float(0xffffffffU));
}

void main() {
    uvec3 p = uvec3(gl_FragCoord.xy, random);
    gl_FragColor = vec4(hash(p), 1.0);
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 模拟信号不好的雪花点
 */
export default class Snowflake extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                random: {
                    value: 0
                },
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'snowflake';
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) {
        this.setRandom(Math.random() * 1000000);
    }

    /**
     * 
     * 设置随机值
     * 
     * @param {Number} value 
     */
    setRandom(value) {
        this.uniforms.random.value = value;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
