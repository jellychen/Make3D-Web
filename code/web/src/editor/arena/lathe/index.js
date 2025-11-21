/* eslint-disable no-unused-vars */

import Editor from './v';

/**
 * 
 * 显示车床编辑页面
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function ShowEditor(coordinator) {
    document.body.appendChild(new Editor(coordinator));
}
