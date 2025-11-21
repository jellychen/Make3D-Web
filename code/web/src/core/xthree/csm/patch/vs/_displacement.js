/* eslint-disable no-unused-vars */

/**
 * 
 * displacement
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context) {
    return shader_code.replace(
        '#include <displacementmap_vertex>',
`
#include <displacementmap_vertex>
transformed += normalize(objectNormal) * m3c_displacement_offset + m3c_displacement_bias;
`
    );
}
