/* eslint-disable no-unused-vars */

import isNumber         from 'lodash/isNumber';
import ComputePosition  from '@common/misc/compute-position';
import EnvmapSelector   from './v';

/**
 * 
 * @param {*} reference_element 
 * @param {*} placement 
 * @param {*} offset 
 * @param {*} callback 
 */
export default function show(reference_element, offset, callback) {
    const selector = new EnvmapSelector();
    selector.on_selected = callback;
    document.body.appendChild(selector);
    if (!isNumber(offset)) {
        offset = 10;
    }
    ComputePosition(reference_element, selector, 'auto', offset);
}