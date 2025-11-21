/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isFunction      from 'lodash/isFunction';
import ComputePosition from '@common/misc/compute-position';
import DropMenu        from '@ux/controller/drop-menu';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    {
        text_token: "shadow-quality-low",
        token     : "low",
    },

    {
        text_token: "shadow-quality-normal",
        token     : "normal",
    },

    {
        text_token: "shadow-quality-high",
        token     : "high",
    },
];

/**
 * 
 * 显示质量
 * 
 * @param {*} ref_element 
 * @param {*} callback 
 * @returns 
 */
export default function ShowMenu(ref_element, callback) {
    const menu = DropMenu(
        menu_item_data,
        (token) => {
            if (isFunction(callback)) {
                try {
                    callback(token);
                } catch(e) {
                    console.error(e);
                }
            }
        },
        () => {},
        false,
        true);

    document.body.appendChild(menu);
    ComputePosition(ref_element, menu, 'auto', 5);
    return menu;
}