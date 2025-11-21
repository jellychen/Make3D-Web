/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
uniform float pointSize;
void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = pointSize;
}`;

const shader_fs = `
uniform float pointSize;
uniform float r0;
uniform float r1;
uniform float gap;
uniform vec3 color;

void main() {
    float half_point_size = pointSize / 2.0;
    float a = 0.0;
    vec2 current_xy = gl_PointCoord * pointSize;

    // 原点
    vec2 origin = vec2(half_point_size, half_point_size);

    // 首先判断在不在大圆里面
    float d = distance(current_xy, origin);
    a = 1.0 - smoothstep(r0 - 0.5, r0, d);

    // 然后判断在不在6个小圆里面
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 6.28318530718 / 8.0; // 2 * PI / 8
        float rr = r0 + r1 + gap;
        vec2 center = vec2(rr * cos(angle), rr * sin(angle)) + origin;
        float d = distance(current_xy, center);
        float new_a = 1.0 - smoothstep(r1 - 0.5, r1, d);
        a = max(new_a, a);
    }
        
    if (a < 0.01) {
        discard;
    }
    gl_FragColor = vec4(color * a, a);
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;

/**
 * 灯光绘制材质
 */
export default class LightIconMaterial extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            uniforms: {
                color: {
                    value: new XThree.Color(0xffffff)
                },

                pointSize: {
                    value: 10
                },

                r0: {
                    value: 4
                },

                r1: {
                    value: 1
                },

                gap: {
                    value: 2
                }
            },
        });
        this.allowOverride = false;
        this.transparent   = true;
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
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setPointSize(size) {
        this.uniforms.pointSize.value = size;
        this.needsUpdate = true;
    }

    /**
     * 
     * 设置大圆的尺寸
     * 
     * @param {*} r 
     */
    setR0(r) {
        this.uniforms.r0.value = r;
    }

    /**
     * 
     * 设置小圆的尺寸
     * 
     * @param {*} r 
     */
    setR1(r) {
        this.uniforms.r1.value = r;
    }

    /**
     * 
     * 设置距离
     * 
     * @param {*} gap 
     */
    setGap(gap) {
        this.uniforms.gap.value = gap;
    }
}
