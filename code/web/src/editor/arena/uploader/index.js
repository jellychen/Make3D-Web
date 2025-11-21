/* eslint-disable no-unused-vars */

import isNumber from 'lodash/isNumber';
import Uploader from './v';

/**
 * 
 * 用来显示上传的组件
 * 
 * @param {*} coordinator 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} dock 
 * @returns 
 */
export default function(coordinator, reference_element, offset, dock = 'auto') {
    const uploader = new Uploader(coordinator);
    document.body.appendChild(uploader);
    if (!isNumber(offset)) {
        offset = 0;
    }
    uploader.show(reference_element, offset, dock);
    return uploader;
}
