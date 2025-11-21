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
        '#include <roughnessmap_fragment>',
`
#include <roughnessmap_fragment>
roughnessFactor = m3c_roughness;
`
    );
}
