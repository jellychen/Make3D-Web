/* eslint-disable no-unused-vars */

import ShaderGraphEditor from './v';

/**
 * 
 * 显示材质编辑器
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function ShowShaderGraphEditor(coordinator) {
    const abattoir = coordinator.abattoir;
    const view = new ShaderGraphEditor(coordinator);
    abattoir.dashboard.clear();
    abattoir.dashboard.content.appendChild(view);
    abattoir.dashboard.setShow(true);
    abattoir.dashboard.setUseContentSize(false);
    return view;
}