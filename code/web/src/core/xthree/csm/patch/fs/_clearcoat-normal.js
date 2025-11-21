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
        '#include <clearcoat_normal_fragment_begin>',
`
vec3 m3c_coat_internal_orthogonal = m3c_clearcoat_normal - (dot(m3c_clearcoat_normal, nonPerturbedNormal) * nonPerturbedNormal);
vec3 m3c_coat_internal_projectedbump = mat3(m3c_internal_model_view_matrix) * m3c_coat_internal_orthogonal;
vec3 clearcoatNormal = normalize(nonPerturbedNormal - m3c_coat_internal_projectedbump);
`
    );
}
