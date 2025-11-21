/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
varying vec3 vViewPosition;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}`;

const shader_fs = `
#define PACK_FLOAT_MIN 0.0
#define PACK_FLOAT_MAX 102400.0

varying vec3 vViewPosition;
uniform float sid;

vec3 packFloatInto8BitVec3(float v, float min, float max) {
    float zeroToOne = (v - min) / (max - min);
    float zeroTo24Bit = zeroToOne * 256.0 * 256.0 * 255.0;
    return vec3(mod(zeroTo24Bit, 256.0), mod(zeroTo24Bit / 256.0, 256.0), zeroTo24Bit / 256.0 / 256.0);
}

void main() {
    vec3 camera_dir = normalize(-vViewPosition);
    vec3 fdx = dFdx(-vViewPosition);
	vec3 fdy = dFdy(-vViewPosition);
	vec3 normal = normalize(cross(fdx, fdy));
    float alpha = abs(dot(camera_dir, normal));
    
    gl_FragColor = vec4(packFloatInto8BitVec3(sid, PACK_FLOAT_MIN, PACK_FLOAT_MAX), alpha);
}`;

/**
 * 用来编辑时使用
 */
export default class Material extends XThree.ShaderMaterial {
    /**
     * 编号
     */
    #sid_current = 0;

    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                sid: {
                    value: 0,
                }
            },
        });

        this.onObjectBeforeRender = () => {
            this.uniforms.sid.value = this.#sid_current;
            this.#sid_current += 1;
            this.#sid_current = this.#sid_current % 2048;
            this.uniformsNeedUpdate = true;
        };
    }

    /**
     * 
     * 重置ID
     * 
     * @returns 
     */
    resetSid() {
        this.#sid_current = 0;
        return this;
    }
}
