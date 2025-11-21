/* eslint-disable no-unused-vars */

import Toast from './v';

/**
 * 
 * 显示一个提示框
 * 
 * @param {*} data 
 * @param {*} parent_node 
 * @returns 
 */
export default function(data, parent_node = undefined) {
    data = data || {};
    
    // 构建 Toast
    const toast = new Toast();

    // 设置位置
    // top-left|left-top            0
    // top-center                   1
    // top-right|right-top          2
    // left-center                  3
    // center                       4
    // right-center                 5
    // bottom-left|left-bottom      6
    // bottom-center                7
    // right-bottom|bottom-right    8
    if (data.dock) {
        toast.setLocationDock(data.dock);
    } else {
        let x = data.x || 0;
        let y = data.y || 0;
        toast.setLocation(x, y);
    }

    // 设置文本
    if (data.text_token) {
        toast.setContentDataTokenKey(data.text_token);
    } else if (data.text_data) {
        toast.setContentRaw(data.text_data);
    }

    // 设置类型
    // default
    // success
    // fail
    if (data.type) {
        toast.setType(data.type);
    }

    // 显示
    parent_node = parent_node || document.body;
    parent_node.appendChild(toast);

    return toast;
}
