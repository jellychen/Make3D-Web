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
uniform float sides;
uniform float angle;

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x) + angle;
    float tau = 2. * 3.1416 ;
    a = mod(a, tau/sides);
    a = abs(a - tau/sides/2.) ;
    p = r * vec2(cos(a), sin(a));
    vec4 color = texture2D(tDiffuse, p + 0.5);
    gl_FragColor = color;
}`;

/**
 * 万花筒
 */
export default class Kaleido extends XThree.ShaderMaterial {
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

                sides: {
                    value: 6.0
                },

                angle: {
                    value: 0.0
                }
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'kaleido';
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
     * number of reflections
     * 
     * @param {Number} sides 
     */
    setSides(sides) {
        this.uniforms.sides.value = sides;
        this.needsUpdate = true;
    }

    /**
     * 
     * initial angle in radians
     * 
     * @param {*} angle 
     */
    setAngle(angle) {
        this.uniforms.angle.value = angle;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
