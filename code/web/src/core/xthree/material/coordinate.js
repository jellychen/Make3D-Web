/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
varying vec3 worldPosition;
uniform float uDistance;
uniform vec2 uPoint;
void main() {
    vec3 pos = position * uDistance;
    pos.xy += uPoint;
    worldPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const shader_fs = `
varying vec3 worldPosition;           
    
uniform float uSize1;
uniform float uSize2;
uniform vec3 uColor;
uniform vec3 uColorX;
uniform vec3 uColorY;
uniform float uDistance;
uniform float uScale;

uniform vec2 uPoint;

float GRID(float size) {
    vec2 r = worldPosition.xy / size;
    vec2 t = fwidth(r);
    vec2 grid = abs(fract(r - 0.5) - 0.5) / t * uScale;
    return 1.0 - min(min(grid.x, grid.y), 1.0);
}

float GRID_X() {
    float r = worldPosition.y;
    float grid = abs(r) / fwidth(r) * uScale;
    return 1.0 - min(grid, 1.0);
}

float GRID_Y() {
    float r = worldPosition.x;
    float grid = abs(r) / fwidth(r) * uScale;
    return 1.0 - min(grid, 1.0);
}
            
void main() {
    vec3 camera_dir = normalize(mat3(viewMatrix) * vec3(0, 0, 1));
    float alpha = smoothstep(0.0, 0.1, abs(dot(vec3(0, 0, 1), camera_dir))) * 0.6;
    float d  = 1.0 - min(distance(uPoint, worldPosition.xy) / uDistance, 1.0);
    float g1 = GRID(uSize1);
    float g2 = GRID(uSize2);
    float gx = GRID_X();
    float gy = GRID_Y();
    float pd = pow(d, 8.0);
    vec4 color_0 = vec4(uColor.rgb, mix(g2, g1, g1) * pd);
    color_0.a = mix(0.5 * color_0.a, color_0.a, g2);
    vec4 cx = mix(vec4(0), vec4(uColorX, pd), gx);
    vec4 cy = mix(vec4(0), vec4(uColorY, pd), gy);
    color_0 = max(cx, max(cy, color_0));
    color_0.a *= alpha;
    gl_FragColor = linearToOutputTexel(color_0);
}`;

/**
 * 用来编辑时使用
 */
export default class Material extends XThree.ShaderMaterial {
    /**
     * 参数
     */
    #size1 = 1;
    #size2 = 5;

    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,
            side          : XThree.DoubleSide,

            uniforms: {
                uSize1: {
                    value: 1
                },

                uSize2: {
                    value: 5
                },

                uColor: {
                    value: new XThree.Color(0x686868)
                },

                uColorX: {
                    value: new XThree.Color(0xEF362E)
                },

                uColorY: {
                    value: new XThree.Color(0x1eCE6E)
                },

                uDistance: {
                    value: 10000
                },

                uPoint: {
                    value: new XThree.Vector2(0, 0)
                },

                uScale: {
                    value: 1
                }
            },

            transparent: true,

            extensions: {
                derivatives: true
            }
        });
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.uniforms.uColor.value = new XThree.Color(color);
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 设置X轴显示的颜色
     * 
     * @param {*} color 
     */
    setXCoordColor(color) {
        this.uniforms.uColorX.value = new XThree.Color(color);
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 设置y轴显示的颜色
     * 
     * @param {*} color 
     */
    setYCoordColor(color) {
        this.uniforms.uColorY.value = new XThree.Color(color);
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 设置显示的最大距离
     * 
     * @param {*} distance 
     */
    setDistance(distance) {
        this.uniforms.uDistance.value = distance;
        this.needsUpdate = true;
        return this;
    }

    /**
     * 
     * 用来控制线宽
     * 
     * @param {Number} scale 
     */
    setScale(scale) {
        if (scale == this.uniforms.uScale) {
            return this;
        }
        scale                      = Math.min(scale, 0.8);
        this.uniforms.uScale.value = scale;
        this.needsUpdate           = true;
        return this;
    }

    /**
     * 
     * 设置相对的点
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    setPoint(x, y) {
        const point = this.uniforms.uPoint;
        if (point.x == x && point.y == y) {
            return this;
        }

        point.x          = x;
        point.y          = y;
        this.needsUpdate = true;
        return this;
    }
}
