/* eslint-disable no-unused-vars */

import _MAIN         from "./_main";
import _POSITION     from "./_position";
import _POSITION_RAW from "./_position-raw";
import _NORMAL       from "./_normal";
import _DISPLACEMENT from "./_displacement";

/**
 * 
 * 材质
 * 
 * @param {*} shader_code 
 * @param {*} context 
 * @returns 
 */
export default function(shader_code, context = {}) {
    shader_code = _MAIN        (shader_code, context);
    shader_code = _POSITION    (shader_code, context);
    shader_code = _POSITION_RAW(shader_code, context);
    shader_code = _NORMAL      (shader_code, context);
    shader_code = _DISPLACEMENT(shader_code, context);
    return shader_code;
}
