/* eslint-disable no-unused-vars */

import isNumber        from 'lodash/isNumber';
import ComputePosition from '@common/misc/compute-position';
import UserInfo        from './v';

/**
 * 
 * 显示用户的信息和属性
 * 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} dock 
 */
export default function(reference_element, offset, dock = 'auto') {
    const info = new UserInfo();
    document.body.appendChild(info);
    if (!isNumber(offset)) {
        offset = 0;
    }

    if (reference_element) {
        ComputePosition(reference_element, info, dock, offset);
    }
}
