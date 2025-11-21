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
        '#include <normal_fragment_maps>',
`
#include <normal_fragment_maps>

vec3 m3c_internal_orthogonal = m3c_bump - (dot(m3c_bump, normal) * normal);
vec3 m3c_internal_projectedbump = mat3(m3c_internal_model_view_matrix) * m3c_internal_orthogonal;
normal = normalize(normal - m3c_internal_projectedbump);
`
    );
}
