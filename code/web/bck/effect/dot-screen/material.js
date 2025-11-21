/* eslint-disable no-undef */

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
uniform vec2 center;
uniform float angle;
uniform float scale;
uniform vec2 tSize;

uniform sampler2D tDiffuse;

varying vec2 vUv;

float pattern() {
    float s = sin( angle ), c = cos( angle );
    vec2 tex = vUv * tSize - center;
    vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
    return ( sin( point.x ) * sin( point.y ) ) * 4.0;
}

void main() {
    vec4 color = texture2D( tDiffuse, vUv );
    float average = ( color.r + color.g + color.b ) / 3.0;
    gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );
}`;

/**
 * Dot screen shader
 */
export default class DotScreen extends XThree.ShaderMaterial {
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

                tSize: {
                    value: new XThree.Vector2(256, 256)
                },

                center: {
                    value: new XThree.Vector2(0.5, 0.5)
                },

                angle: {
                    value: 1.57
                },

                scale: {
                    value: 1.0
                }
            },
        });

        this.colorWrite   = true ;
        this.depthTest    = false;
        this.depthWrite   = false;
        this.stencilWrite = false;
        this.is_postprocessing_effect_material = true;
        this.type = 'dot-screen';
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
     * 设置分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    setResolution(width, height) {
        this.uniforms.tSize.value.x = width;
        this.uniforms.tSize.value.y = height;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setCenter(x, y) {
        this.uniforms.center.value.x = x;
        this.uniforms.center.value.y = y;
        this.needsUpdate = true;
    }

    /**
     * 
     * @param {Number} angle 
     */
    setAngle(angle) {
        this.uniforms.angle.value = angle;
        this.needsUpdate = true;
    }

    /**
     * 
     * @param {Number} scale 
     */
    setScale(scale) {
        this.uniforms.scale.value = scale;
        this.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
