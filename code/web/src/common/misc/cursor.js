/* eslint-disable no-unused-vars */

import isString from 'lodash/isString';
import Cursor   from '@assets/assets-cursor';

/**
 * 
 * 设置鼠标样式
 * 
 * @param {*} element 
 * @param {*} cursor 
 */
export default function(element, cursor) {
    if (!isString(cursor)) {
        return;
    }

    const base64 = Cursor(cursor);
    if (!base64) {
        element.style.cursor = cursor;
    } else {
        element.style.cursor = `-webkit-image-set(url("${base64}") 2x) 4 4, auto`;
    }
}
