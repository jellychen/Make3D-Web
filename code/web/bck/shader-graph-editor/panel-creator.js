/* eslint-disable no-unused-vars */

import ShaderGraphPanel from './panel';

/**
 * 
 * 构建
 * 
 * @param {*} context 
 * @param {*} topo 
 * @param {*} tpl 
 * @param {*} uuid 
 * @returns 
 */
export default function PanelCreator(context, topo, tpl, uuid) {
    return new ShaderGraphPanel(context, uuid, tpl, topo);
}
