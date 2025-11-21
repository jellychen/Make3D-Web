/* eslint-disable no-unused-vars */

import Embedded from "./embedded";

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
        '#include <opaque_fragment>',
`
#include <opaque_fragment>

{
    //
    // Calc Color
    //
    V_4 m3d_pbr_color = gl_FragColor;
    V_4 m3d_cur_color = m3d_pbr_color;
    V_4 m3d_out       = V_4(0);

    //
    // CSM Embedded
    //
    ${context.requirement.matcap ? Embedded.MatcapUV : ''}
    
    //
    // Body 
    //
    ${context.body ? context.body : ''}

    //
    // Write Color
    //
    gl_FragColor = m3d_cur_color;
}
`
    );
}
