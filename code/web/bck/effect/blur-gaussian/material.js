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
uniform sampler2D texture_data;
uniform float RADIUS;
uniform float sigma;
uniform float ResolutionX;
uniform float ResolutionY;

varying vec2 vUv;

float PI = 3.14159;

// PDF
float gaussianBlur(float sigma, float x, float y) {
    return exp(-(x * x + y * y) / (2.0 * sigma * sigma)) / (2.0 * sigma * sigma * PI);
}

vec4 computedBlur(float gauss, vec4 inputColor) {
    return (inputColor * gauss);
}

vec4 blurColor(vec2 uv) {
    vec4 color = vec4(0.0);
    float sum = 0.0;
    for (float r = -RADIUS; r <= RADIUS; r++) {
        for (float c = -RADIUS; c <= RADIUS; c++) {
            vec2 target = uv + vec2(r / ResolutionX, c / ResolutionY);
            float gauss = gaussianBlur(sigma, r, c);
            color += computedBlur(gauss, texture(texture_data, target));
            sum += gauss;
        }
    }
    color /= sum;
    return color;
}

void main() {
    gl_FragColor = blurColor(vUv);
}`;

/**
 * 高斯模糊渲染材质
 */
export default class Gaussian extends XThree.ShaderMaterial {
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

                RADIUS: {
                    value: 6,
                },

                sigma: {
                    value: 3,
                },

                ResolutionX: {
                    value: 10,
                },

                ResolutionY: {
                    value: 10,
                },
            },
        });
        
        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'blur-gaussian';
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) {
        let resolution_w = context.resolution_w || 1;
        let resolution_h = context.resolution_h || 1;
        this.setResolution(resolution_w, resolution_h);
    }

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
     * 设置模糊半径
     * 
     * @param {Number} radius 
     */
    setRadius(radius) {
        this.uniforms.RADIUS.value = radius;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置高斯模糊的sigma
     * 
     * @param {Number} sigma 
     */
    setSigma(sigma) {
        this.uniforms.sigma.value = sigma;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    setResolution(width, height) {
        this.uniforms.ResolutionX.value = width;
        this.uniforms.ResolutionY.value = height;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
