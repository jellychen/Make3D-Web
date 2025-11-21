/* eslint-disable no-unused-vars */

import isNumber         from 'lodash/isNumber';
import ComputePosition  from '@common/misc/compute-position';
import PBR              from './v';

/**
 * 
 * 显示
 * 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} material 
 * @param {*} on_material_changed 
 */
export default function show(
    reference_element, 
    offset, 
    material, 
    on_material_changed) {
    const panel = new PBR(material, on_material_changed);
    document.body.appendChild(panel);

    if (!isNumber(offset)) {
        offset = 0;
    }

    if (reference_element) {
        ComputePosition(reference_element, panel, 'auto', offset);
    }

    return panel;
}
