/* eslint-disable no-unused-vars */

import ComputePosition from '@common/misc/compute-position';
import Dropper         from './v';

/**
 * 
 * 打开
 * 
 * @param {*} coordinator 
 * @param {*} ref_element 
 * @returns 
 */
export default function(coordinator, ref_element) {
    const dropper = new Dropper(coordinator);
    const container = dropper.container;
    document.body.appendChild(dropper);
    ComputePosition(ref_element, container, 'bottom-start');
    return dropper;
}
