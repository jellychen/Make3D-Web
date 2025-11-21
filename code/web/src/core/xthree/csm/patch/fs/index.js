/* eslint-disable no-unused-vars */

import _PREPARE             from "./_prepare";
import _MAIN                from "./_main";
import _AO                  from "./_ao";
import _BUMP                from "./_bump";
import _CLEARCOAT_NORMAL    from "./_clearcoat-normal";
import _CLEARCOAT_ROUGHNESS from "./_clearcoat-roughness";
import _CLEARCOAT           from "./_clearcoat";
import _DIFFUSE_COLOR       from './_diffuse-color';
import _EMISSIVE            from './_emissive';
import _FRAG_COLOR          from './_frag-color';
import _FRAG_NORMAL         from './_frag-normal';
import _IRIDESCENCE         from './_iridescence';
import _METALNESS           from './_metalness';
import _ROUGHNESS           from './_roughness';
import _THICKNESS           from './_thickness';
import _TRANSMISSION        from './_transmission';

/**
 * 
 * 材质
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context = {}) {
    shader_code = _PREPARE            (shader_code, context);
    shader_code = _MAIN               (shader_code, context);
    shader_code = _AO                 (shader_code, context);
    shader_code = _BUMP               (shader_code, context);
    shader_code = _CLEARCOAT_NORMAL   (shader_code, context);
    shader_code = _CLEARCOAT_ROUGHNESS(shader_code, context);
    shader_code = _CLEARCOAT          (shader_code, context);
    shader_code = _DIFFUSE_COLOR      (shader_code, context);
    shader_code = _EMISSIVE           (shader_code, context);
    shader_code = _FRAG_COLOR         (shader_code, context);
    shader_code = _FRAG_NORMAL        (shader_code, context);
    shader_code = _IRIDESCENCE        (shader_code, context);
    shader_code = _METALNESS          (shader_code, context);
    shader_code = _ROUGHNESS          (shader_code, context);
    shader_code = _THICKNESS          (shader_code, context);
    shader_code = _TRANSMISSION       (shader_code, context);
    return shader_code;
}
