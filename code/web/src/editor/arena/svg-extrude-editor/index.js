/* eslint-disable no-unused-vars */

import Editor from './v';
import             './v.add.to.scene';
import             './v.convert.polygon.add.to.scene';

/**
 * 
 * 显示
 * 
 * @param {*} coordinator 
 * @param {*} svg_str 
 * @returns 
 */
export default function ShowEditor(coordinator, svg_str) {
    const editor = new Editor(coordinator, svg_str);
    document.body.append(editor);
    return editor;
}