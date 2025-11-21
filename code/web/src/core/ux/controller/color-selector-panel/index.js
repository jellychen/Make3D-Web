/* eslint-disable no-unused-vars */

import ColorSelectorPanel from './v';

/**
 * 
 * 创建 Panel
 * 
 * @param {*} data 
 * @param {*} parent_node 
 */
export default function(data, parent_node) {
    data = data = {};
    const panel = new ColorSelectorPanel();
    parent_node = parent_node || document.body;
    parent_node.appendChild(panel);
    return panel;
}
