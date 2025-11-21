/* eslint-disable no-unused-vars */

import isString from "lodash/isString";
import isObject from "lodash/isObject";
import Embedded from "./embedded";

/**
 * 临时
 */
const regex = /void\s*main\s*\(\s*\)\s*{/gm;

/**
 * 
 * 材质
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context) {
    let defines_str = '';
    if (isObject(context.defines)) {
        for (const k in context.defines) {
            if (!isString(k)) {
                continue;
            }

            const v = context.defines[k];
            if (!isString(v)) {
                continue;
            }

            defines_str += `#define ${k} ${v}`;
            defines_str += "\r\n";
        }
    }

    return shader_code.replace(
        regex,
`
//
// CSM BY Make3D
//
vec3 m3c_position;
vec3 m3c_normal;
vec3 m3c_displacement_offset;
vec3 m3c_displacement_bias;

//
// CSM Defines
//
${defines_str}
    
//
// CSM Before Main
//
${context.before_main ? context.before_main : ''}

//
// CSM Embedded
//
${context.requirement.perlin_noise ? Embedded.PerlinNoise : ''}

//
// CSM Uniforms
//
${context.uniforms_declare ? context.uniforms_declare: ''}

//
// CSM Varying
//
varying mat4 m3c_internal_model_view_matrix;
varying vec3 m3c_internal_normal;
varying vec4 m3c_internal_view_position;
varying vec3 m3c_internal_view_normal;
varying vec3 m3c_internal_view_dir;
varying vec3 m3c_internal_local_position;
varying vec4 m3c_internal_world_position;

//
// CSM Main
//
void main() {

    //
    // CSM Init
    //
    {
        m3c_position            = position;
        m3c_normal              = normal;
        m3c_displacement_offset = vec3(0, 0, 0);
        m3c_displacement_bias   = vec3(0, 0, 0);
    }

    //
    // CSM Body
    //
    {
        ${context.body ? context.body : ''}
    }

    //
    // CSM Varying
    //
    {
        m3c_internal_model_view_matrix   = modelViewMatrix;
        m3c_internal_view_position       = modelViewMatrix * vec4(m3c_position, 1.0);
        m3c_internal_view_position.xyz  /= m3c_internal_view_position.w;
        m3c_internal_normal              = m3c_normal;
        m3c_internal_view_normal         = normalize(normalMatrix * normal);
        m3c_internal_view_dir            = normalize(-m3c_internal_view_position.xyz);
        m3c_internal_local_position      = m3c_position;
        m3c_internal_world_position      = modelMatrix * vec4(position, 1.);
    }
`,
    );
}
