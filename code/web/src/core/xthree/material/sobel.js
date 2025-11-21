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
uniform sampler2D mask_texture;
uniform vec3 color;

varying vec2 vUv;

void main() {
    vec2 texture_size  = vec2(textureSize(mask_texture, 0).xy);
    vec2 texel = vec2(1.0 / texture_size.x, 1.0 / texture_size.y);
    vec2 uv = vUv;
        
    // kernel definition (in glsl matrices are filled in column-major order)
    const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
    const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel

    // fetch the 3x3 neighbourhood of a fragment
    // first column
    float tx0y0 = texture2D(mask_texture, uv + texel * vec2(-1, -1)).r;
    float tx0y1 = texture2D(mask_texture, uv + texel * vec2(-1,  0)).r;
    float tx0y2 = texture2D(mask_texture, uv + texel * vec2(-1,  1)).r;

    // second column
    float tx1y0 = texture2D(mask_texture, uv + texel * vec2( 0, -1)).r;
    float tx1y1 = texture2D(mask_texture, uv + texel * vec2( 0,  0)).r;
    float tx1y2 = texture2D(mask_texture, uv + texel * vec2( 0,  1)).r;

    // third column
    float tx2y0 = texture2D(mask_texture, uv + texel * vec2( 1, -1)).r;
    float tx2y1 = texture2D(mask_texture, uv + texel * vec2( 1,  0)).r;
    float tx2y2 = texture2D(mask_texture, uv + texel * vec2( 1,  1)).r;

    // gradient value in x direction
    float valueGx = 
        Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
		Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
		Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;
        
    // gradient value in y direction
    float valueGy = 
        Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
		Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
		Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    // magnitute of the total gradient
    float G = sqrt((valueGx * valueGx) + (valueGy * valueGy));
    gl_FragColor = linearToOutputTexel(vec4(color, G));
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
                    value: new XThree.Color(0x48FF9C),
                },
            },
        });

        this.visible       = true;
        this.depthTest     = false;
        this.depthWrite    = false;
        this.transparent   = false;
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
}
