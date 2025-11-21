/* eslint-disable no-unused-vars */

import * as THREE from 'three';

/**
 * 
 * 材质
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context) {
    shader_code = shader_code.replace(
        '#include <lights_physical_fragment>',
        THREE.ShaderChunk.lights_physical_fragment
    );

    shader_code = shader_code.replace(
        '#include <transmission_fragment>',
        THREE.ShaderChunk.transmission_fragment
    );
    
    return shader_code;
}
