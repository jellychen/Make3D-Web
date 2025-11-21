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
        'material.clearcoat = clearcoat;',
`
material.clearcoat = m3c_clearcoat;
`
    );
}
