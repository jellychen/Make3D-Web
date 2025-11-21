/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

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
#define PACK_FLOAT_MIN      0.0
#define PACK_FLOAT_MAX      102400.0
#define ENHANCEMENT_ALPHA   0.4

uniform float intensity;
uniform sampler2D mask_texture;
uniform vec3 color;

varying vec2 vUv;

mat3 sx = mat3(1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0);
mat3 sy = mat3(1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0);

float unpack8BitVec3IntoFloat(vec3 v, float min, float max) {
    float zeroTo24Bit = v.x + v.y * 256.0 + v.z * 256.0 * 256.0;
    float zeroToOne = zeroTo24Bit / 256.0 / 256.0 / 256.0;
    return zeroToOne * (max - min) + min;
}

void main() {
    vec2 texture_size = vec2(textureSize(mask_texture, 0).xy);
    vec2 texture_coord = vUv;

    mat3 I;

    // chenguodong
    // 模拟blender的边缘增强行为
    // 周围的9个像素中只要有一个像素是透明的
    // 这部分直接剔除
    float alpha_min = 1.0;

    for (int i=0; i < 3; i++) {
        for (int j=0; j < 3; j++) {
            vec2 offset = vec2(float(i - 1), float(j - 1)) / texture_size;
            // I[i][j] = length(texture(mask_texture, texture_coord + offset).rgb);
            vec4 color = texture(mask_texture, texture_coord + offset);
            I[i][j] = unpack8BitVec3IntoFloat(color.rgb, PACK_FLOAT_MIN, PACK_FLOAT_MAX);

            // chenguodong: 取最小的alpha值
            alpha_min = min(alpha_min, color.a);
        }
    }

    if (alpha_min < 0.05) {
        gl_FragColor = vec4(0, 0, 0, 0);
    } else {
        float gx = dot(sx[0], I[0]) + dot(sx[1], I[1]) + dot(sx[2], I[2]); 
        float gy = dot(sy[0], I[0]) + dot(sy[1], I[1]) + dot(sy[2], I[2]);
        float mag = min(length(vec2(gx, gy)) * intensity, 1.0);
        mag = clamp(mag, 0.0, 1.0);
        gl_FragColor = linearToOutputTexel(vec4(color, mag * ENHANCEMENT_ALPHA));
    }
}`;

/**
 * 渲染的材质
 */
export default class Material extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                mask_texture: {
                    value: null,
                },

                color: {
                    value: new XThree.Color(0x212121),
                },

                intensity: {
                    value: 2.0
                },
            },
        });

        this.visible       = true;
        this.depthTest     = false;
        this.depthWrite    = false;
        this.transparent   = true;
        this.toneMapped    = false;
        this.blending      = XThree.CustomBlending;
        this.blendEquation = XThree.AddEquation;
        this.blendSrc      = XThree.SrcAlphaFactor;
        this.blendDst      = XThree.OneMinusSrcAlphaFactor;
    }

    /**
     * 
     * 设置掩码图
     * 
     * @param {*} texture 
     */
    setMask(texture) {
        this.uniforms.mask_texture.value = texture;
        this.needsUpdate = true;
    }

    /**
     *  
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.uniforms.color.value.setHex(color);
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置强度
     * 
     * @param {Number} intensity 
     */
    setIntensity(intensity = 0.5) {
        this.uniforms.intensity.value = intensity;
        this.needsUpdate = true;
    }
}
