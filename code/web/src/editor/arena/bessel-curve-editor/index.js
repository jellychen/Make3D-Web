/* eslint-disable no-unused-vars */

import isNumber        from 'lodash/isNumber';
import ComputePosition from '@common/misc/compute-position';
import Editor          from './v';

/**
 * 
 * 用来显示曲线的编辑器
 * 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} dock 
 * @returns 
 */
export default function(reference_element, offset, dock = 'auto') {
    const editor = new Editor();
    document.body.appendChild(editor);
    if (!isNumber(offset)) {
        offset = 0;
    }

    if (reference_element) {
        ComputePosition(reference_element, editor, dock, offset);
    }
    return editor;
}