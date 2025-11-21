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
        'material.iridescence = iridescence;',
`
material.iridescence = m3c_iridescence;
`
    );
}
