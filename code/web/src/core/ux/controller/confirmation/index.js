/* eslint-disable no-unused-vars */

import isFunction      from 'lodash/isFunction';
import ComputePosition from '@common/misc/compute-position';
import Confirmation    from './v';

/**
 * 
 * 显示
 * 
 * @param {*} reference_element 
 * @param {*} parent_node 
 * @param {*} placement 
 * @param {*} style 
 * @param {*} on_cancel_or_confirm 
 * @param {*} desc_data 
 * @param {*} desc_token 
 */
export default function ShowConfirmation(reference_element = undefined, 
                                         parent_node = undefined,
                                         placement = 'auto',
                                         style = 'black',
                                         on_cancel_or_confirm = () => {},
                                         desc_data = undefined,
                                         desc_token = undefined) {
    const confirmation = new Confirmation();
    
    if (isFunction(on_cancel_or_confirm)) {
        confirmation.on_cancel_or_confirm = on_cancel_or_confirm;
    }
    
    if (style) {
        confirmation.setStyle(style);
    }
    
    if (desc_token) {
        confirmation.setDescToken(desc_token);
    } else if (desc_data) {
        confirmation.setDescData(desc_data);
    }

    // 显示
    parent_node = parent_node || document.body;
    parent_node.appendChild(confirmation);

    // 布局位置
    if (reference_element) {
        ComputePosition(reference_element, confirmation, placement);
    }

    return confirmation;
}
