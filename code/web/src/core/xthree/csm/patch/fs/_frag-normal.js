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
normal = m3c_frag_normal;
`
    );
}
