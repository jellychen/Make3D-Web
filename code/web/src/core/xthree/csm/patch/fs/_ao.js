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
        '#include <aomap_fragment>',
`
#include <aomap_fragment>
reflectedLight.indirectDiffuse *= 1. - m3c_ao;
`
    );
}
