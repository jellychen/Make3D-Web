/* eslint-disable no-undef */

// https://github.com/felixturner/bad-tv-shader/blob/master/BadTVShader.js

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
uniform float time;
uniform float distortion;
uniform float distortion2;
uniform float speed;
uniform float rollSpeed;

varying vec2 vUv;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

/**
 * 用来模拟坏电视的效果
 */
export default class BadTv extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader: shader_vs,
            fragmentShader: shader_fs,
            
            uniforms: {
                tDiffuse: {
                    value: null
                },

                time: {
                    value: 0
                },

                distortion: {
                    value: 3
                },

                distortion2: {
                    value: 5
                },

                speed: {
                    value: 0.2
                },

                rollSpeed: {
                    value: 0.1
                },
            },
        });
        
        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'bad-tv';
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) {
        this.setTime(context.time || 0);
    }

    /**
     * 
     * 设置使用的图
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
     * @param {*} time 
     */
    setTime(time) {
        this.uniforms.time.value = time;
        this.needsUpdate = true;
    }

    /**
     * 
     * 
     * 
     * @param {*} a 
     * @param {*} b 
     */
    setDistortion(a = 3, b = 5) {
        this.uniforms.distortion.value = a;
        this.uniforms.distortion2.value = b;
        this.needsUpdate = true;
    }

    /**
     * 
     * @param {*} speed 
     */
    setSpeed(speed) {
        this.uniforms.speed.value = speed;
        this.needsUpdate = true;
    }

    /**
     * 
     * @param {*} speed 
     */
    setRollSpeed(speed) {
        this.uniforms.rollSpeed.value = speed;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
