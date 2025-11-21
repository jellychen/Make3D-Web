/* eslint-disable no-unused-vars */

/**
 * 
 * 材质
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context) {
    return shader_code.replace(
        '#include <beginnormal_vertex>',
`
vec3 objectNormal = m3c_normal;
#ifdef USE_TANGENT
    vec3 objectTangent = vec3(tangent.xyz);
#endif
`
    );
}
