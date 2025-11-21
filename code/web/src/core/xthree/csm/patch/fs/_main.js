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
// Edited by Chenguodong
//
#define V_2 vec2
#define V_3 vec3
#define V_4 vec4
#define M_2 mat2
#define M_3 mat3
#define M_4 mat4
#define F32 float

//
// CSM Var
//
V_4 m3c_diffuse_color;
V_4 m3c_frag_color;
V_3 m3c_emissive;
F32 m3c_roughness;
F32 m3c_metalness;
F32 m3c_iridescence;
F32 m3c_clearcoat;
F32 m3c_clearcoat_roughness;
V_3 m3c_clearcoat_normal;
F32 m3c_transmission;
F32 m3c_thickness;
F32 m3c_ao;
V_3 m3c_bump;
V_3 m3c_frag_normal;

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
${context.requirement.blend         ? Embedded.Blend        : ''}
${context.requirement.fresnel       ? Embedded.Fresnel      : ''}
${context.requirement.simplex_noise ? Embedded.SimplexNoise : ''}
${context.requirement.hash          ? Embedded.Hash         : ''}

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
        m3c_diffuse_color = vec4(1, 1, 1, 1);
        m3c_frag_color    = vec4(1, 1, 1, 1);

#ifdef USE_MAP
        vec4 _m3c_sampled_diffuse_color = texture2D(map, vMapUv);

    #ifdef DECODE_VIDEO_TEXTURE
        // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
        _m3c_sampled_diffuse_color = vec4(mix(pow(_m3c_sampled_diffuse_color.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _m3c_sampled_diffuse_color.rgb * 0.0773993808, vec3(lessThanEqual(_m3c_sampled_diffuse_color.rgb, vec3(0.04045)))), _m3c_sampled_diffuse_color.w);
    #endif

        m3c_diffuse_color = vec4(diffuse, opacity) * _m3c_sampled_diffuse_color;
        m3c_frag_color    = vec4(diffuse, opacity) * _m3c_sampled_diffuse_color;
#else
        m3c_diffuse_color = vec4(diffuse, opacity);
        m3c_frag_color    = vec4(diffuse, opacity);
#endif

        m3c_emissive  = emissive;
        m3c_roughness = roughness;
        m3c_metalness = metalness;

#ifdef USE_IRIDESCENCE
        m3c_iridescence = iridescence;
#else
        m3c_iridescence = 0.0;
#endif

#ifdef USE_CLEARCOAT
        m3c_clearcoat = clearcoat;
        m3c_clearcoat_roughness = clearcoatRoughness;
#else
        m3c_clearcoat = 0.0;
        m3c_clearcoat_roughness = 0.0;
#endif

#ifdef USE_TRANSMISSION
        m3c_transmission = transmission;
        m3c_thickness    = thickness;
#else
        m3c_transmission = 0.0;
        m3c_thickness    = 0.0;
#endif

        m3c_ao          = 0.0;
        m3c_bump        = vec3(0.0);

#ifdef FLAT_SHADED
        vec3 fdx        = dFdx(vViewPosition);
        vec3 fdy        = dFdy(vViewPosition);
        m3c_frag_normal = normalize(cross(fdx, fdy));
#else
        m3c_frag_normal = normalize(vNormal);
    #ifdef DOUBLE_SIDED
        m3c_frag_normal*= gl_FrontFacing ? 1.0 : - 1.0;
    #endif
#endif
    }
`,
    );
}
