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
        'vec3 totalEmissiveRadiance = emissive;',
`
vec3 totalEmissiveRadiance = m3c_emissive;
`
    );
}
