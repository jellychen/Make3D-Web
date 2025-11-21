/* eslint-disable no-unused-vars */

import isNumber        from 'lodash/isNumber';
import ComputePosition from '@common/misc/compute-position';
import MatcapSelector  from './v';

/**
 * 
 * 显示
 * 
 * @param {*} reference_element 
 * @param {*} placement 
 * @param {*} offset 
 * @param {*} callback 
 */
export default function show(reference_element, offset, callback) {
    const selector = new MatcapSelector();
    selector.on_selected = callback;
    document.body.appendChild(selector);
    if (!isNumber(offset)) {
        offset = 0;
    }
    ComputePosition(reference_element, selector, 'auto', offset);
}
