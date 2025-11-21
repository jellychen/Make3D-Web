/* eslint-disable no-unused-vars */

import * as XThree from 'three';

/**
 * shader
 */
const shader_vs = `
#include <common>
#include <logdepthbuf_pars_vertex>

varying vec3 vViewPosition;

#ifdef SMOOTH
#if 1 == SMOOTH

varying vec3 vNormal;

#endif
#endif

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = mvPosition.xyz;

#if 1 == SMOOTH

    vNormal = normalize(normalMatrix * normal);

#endif

    #include <logdepthbuf_vertex>
}`;

const shader_fs = `
#include <common>
#include <logdepthbuf_pars_fragment>

uniform vec3 color_front;
uniform vec3 color_back;
uniform float opacity;
uniform float enhance;
uniform float high_contrast;

varying vec3 vViewPosition;

#if 1 == SMOOTH

varying vec3 vNormal;

#endif

void main() {

    #include <logdepthbuf_fragment>

    vec3 n0 = normalize(-vViewPosition);
    vec3 normal;

#if 1 == SMOOTH

    normal = vNormal;
    
#else
    
    vec3 fdx = dFdx(-vViewPosition);
	vec3 fdy = dFdy(-vViewPosition);
    normal = normalize(cross(fdx, fdy));

#endif
    
    float c = 1.0 - dot(normal, n0);
    vec3 color = gl_FrontFacing ? color_front : color_back;
    float factor = pow(abs(c), enhance);
    gl_FragColor = vec4(color * factor * opacity, opacity);
    gl_FragColor = linearToOutputTexel(gl_FragColor);
}`;


/**
 * 用来编辑时使用
 */
class DefaultHighlightMaterial extends XThree.ShaderMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super({
            vertexShader  : shader_vs,
            fragmentShader: shader_fs,

            defines: {
                "SMOOTH": 1,
            },

            uniforms: {
                enhance: { 
                    value: 1
                },

                high_contrast: { 
                    value: 0.0
                },
                
                color_front: {
                    value: new XThree.Color(0x0)
                },

                color_back: {
                    value: new XThree.Color(0x0)
                },

                opacity: {
                    value: 0.5
                }
            },
        });
        this.side = XThree.DoubleSide;
    }
}

const material = new DefaultHighlightMaterial();
material.transparent = true;

export default material;
