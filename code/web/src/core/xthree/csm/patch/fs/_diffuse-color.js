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
        '#include <color_fragment>',
`
#include <color_fragment>
diffuseColor = m3c_diffuse_color;
`
    );
}
