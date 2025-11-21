/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

const shader_vs = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`;

const shader_fs = `
precision highp float;

uniform sampler2D depthTexture;
uniform float near;
uniform float far;

uniform vec2 viewport_size;

varying vec2 vUv;

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );

vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}

void main() {
    
    float depth = 0.0;

#if 0

    float offset_x = 1.0 / viewport_size.x;
    float offset_y = 1.0 / viewport_size.y;
    for (int i = -1; i < 2; ++i) {
        for (int j = -1; j < 2; ++j) {
            vec2 offset;
            offset.x = float(i) * offset_x;
            offset.y = float(j) * offset_y;
            depth = max(depth, texture(depthTexture, vUv + offset).r);
        }
    }

#else

    depth = texture(depthTexture, vUv).r;

#endif

    gl_FragColor = packDepthToRGBA(depth);
}`;

/**
 * 拷贝
 */
export default class Copy extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,
            side          : XThree.DoubleSide,
            depthTest     : false,
            depthWrite    : false,

            uniforms : {
                depthTexture : {
                    value: null
                },

                near : {
                    value: 0.1
                },

                far : {
                    value: 1000,
                },

                viewport_size: {
                    value: new XThree.Vector2(1024, 1024),
                }
            },
        });
    }

    /**
     * 
     * 设置深度图
     * 
     * @param {*} texture 
     */
    setDepthTexture(texture) {
        this.uniforms.depthTexture.value = texture;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置视椎体的
     * 
     * @param {Number} near 
     * @param {Number} far 
     */
    setFrustumNearAndFar(near, far) {
        this.uniforms.near.value = parseFloat(near);
        this.uniforms.far .value = parseFloat(far );
        this.needsUpdate         = true;
    }
}
