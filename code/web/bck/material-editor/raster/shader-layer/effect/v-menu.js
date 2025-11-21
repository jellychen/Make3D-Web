/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isFunction      from 'lodash/isFunction';
import isSet           from 'lodash/isSet';
import ComputePosition from '@common/misc/compute-position';
import DropMenu        from '@ux/controller/drop-menu';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    {
        enable    : true,
        text_token: "material.ao",
        token     : "ao",
    },

    {
        enable    : true,
        text_token: "material.clearcoat",
        token     : "clearcoat",
    },

    {
        enable    : true,
        text_token: "material.color",
        token     : "color",
    },

    {
        enable    : true,
        text_token: "material.emissive",
        token     : "emissive",
    },

    {
        enable    : true,
        text_token: "material.metalness",
        token     : "metalness",
    },

    {
        enable    : true,
        text_token: "material.normal",
        token     : "normal",
    },

    {
        enable    : true,
        text_token: "material.roughness",
        token     : "roughness",
    },

    {
        enable    : true,
        text_token: "material.sheen",
        token     : "sheen",
    },

    {
        enable    : true,
        text_token: "material.specular",
        token     : "specular",
    },

    {
        enable    : true,
        text_token: "material.transmission",
        token     : "transmission",
    },
];

/**
 * 
 * 显示菜单
 * 
 * @param {*} ref_element 
 * @param {*} callback 
 * @param {*} data_set 
 */
export default function ShowMenu(ref_element, callback, data_set = new Set()) {
    if (isSet(data_set)) {
        for (const item of menu_item_data) {
            if (data_set.has(item.token)) {
                item.enable = false;
            } else {
                item.enable = true;
            }
        }
    } else {
        for (const item of menu_item_data) {
            item.enable = true;
        }
    }

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