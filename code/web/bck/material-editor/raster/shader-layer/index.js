/* eslint-disable no-unused-vars */

import                     './notice/v';
import                     './cell';
import                     './receptacle/v';
import                     './receptacle/v-setter-panel';
import LayerContainer from './v';

/**
 * 
 * 显示 Shader 层
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function CreateShaderLayerContainer(coordinator) {
    return new LayerContainer(coordinator);
}
