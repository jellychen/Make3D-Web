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
        '#include <metalnessmap_fragment>',
`
#include <metalnessmap_fragment>
metalnessFactor = m3c_metalness;
`
    );
}
