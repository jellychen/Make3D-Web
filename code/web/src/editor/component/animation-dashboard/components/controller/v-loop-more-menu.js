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
        text  : "Single",
        token : "single",
    },

    {
        text  : "Pingpong",
        token : "pingpong",
    },

    {
        text  : "Loop",
        token : "loop",
    },

    {
        text  : "Pingpong Loop",
        token : "pingpong-loop",
    },
];

/**
 * 
 * 显示菜单
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
    ComputePosition(ref_element, menu, 'auto', 10);
    return menu;
}