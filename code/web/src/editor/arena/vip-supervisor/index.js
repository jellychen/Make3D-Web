/* eslint-disable no-unused-vars */

import ModelUser     from '@editor/dao/model/user';
import VipSupervisor from './v';

/**
 * 
 * 显示
 * 
 * @param {*} reference_element 
 * @param {*} placement 
 * @param {*} offset 
 * @returns 
 */
export default function Show(
    reference_element, placement = "auto", offset = 10) {
    if (ModelUser.vip) {
        return true;
    }
    
    const panel = new VipSupervisor();
    document.body.appendChild(panel);
    panel.place(reference_element, placement, offset);
    return false;
}
