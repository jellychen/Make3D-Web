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
        text_token  : "rt.quality.preview",     // 预览的质量 150spp 
        token       : "preview",
    },

    {
        text_token  : "rt.quality.hd",          // 高清的质量 500spp + 降噪
        token       : "hd",
    },

    {
        text_token  : "rt.quality.super",       // 超级      800spp + 降噪
        token       : "super",
    },

    {
        text_token  : "rt.quality.ultra",       // 超级      1500spp + 降噪
        token       : "ultra",
    },

    {
        text_token  : "rt.quality.ultimate",    // 终极      3000spp + 降噪
        token       : "ultimate",
    },
];

/**
 * 
 * 显示菜单
 * 
 * @param {*} ref_element 
 * @param {*} callback 
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
