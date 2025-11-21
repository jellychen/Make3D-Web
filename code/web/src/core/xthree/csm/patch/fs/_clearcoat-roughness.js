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
        'material.clearcoatRoughness = clearcoatRoughness;',
`
material.clearcoatRoughness = m3c_clearcoat_roughness;
`
    );
}
