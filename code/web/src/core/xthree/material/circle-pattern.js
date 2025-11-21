/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
varying vec3 vPosition;
varying vec2 vUv;
void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const shader_fs = `
uniform vec3 color;
uniform float scale;

varying vec3 vPosition;
varying vec2 vUv;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st - vec2(0.5);
    float range = _radius*0.1;
    return 1. - smoothstep(_radius-range, _radius+range, dot(l, l) * 4.0);
}

void main() {
    vec2 st = vUv * scale;
    st = fract(st);
    float d = distance(vPosition, vec3(0, 0, 0));
    d = 1.0 - smoothstep(0.3, 0.95, d);
    float v = circle(st, 0.5) * 0.3 * d;

#if 0
    vec3 new_color = color * v;
    gl_FragColor = vec4(new_color, v);
#else
    gl_FragColor = vec4(color, v);
#endif

    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 圆形规则纹理
 */
export default class CirclePattern extends XThree.ShaderMaterial {
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                scale: {
                    value: 1.0
                },

                color: {
                    value: new XThree.Color(0xFFFFFF)
                },
            },
        });

        this.transparent = true;
        this.depthWrite  = false;
        this.depthTest   = false;
        this.side        = XThree.DoubleSide;
    }  
    
    /**
     * 
     * 设置缩放值
     * 
     * @param {Number} scale 
     * @returns 
     */
    setScale(scale) {
        this.uniforms.scale.value = scale;
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     * @returns 
     */
    setColor(color) {
        this.uniforms.color.value.setHex(color);
        this.needsUpdate = true;
        return this;
    }
}
