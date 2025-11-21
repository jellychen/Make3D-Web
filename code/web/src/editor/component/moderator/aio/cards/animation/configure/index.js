/* eslint-disable no-unused-vars */

import ComputePosition from '@common/misc/compute-position';
import Configure       from './v';

/**
 * 
 * 显示
 * 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} dock 
 * @returns 
 */
export default function ShowConfigure(reference_element, offset = 5, dock = 'auto') {
    const configure = new Configure();
    document.body.appendChild(configure);
    if (reference_element) {
        ComputePosition(reference_element, configure, dock, offset);
    }
    return configure;
}
