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
        text_token: "material.layer.color",
        token     : "color",
    },
    {
        text_token: "material.layer.depth",
        token     : "depth",
    },
    {
        text_token: "material.layer.diffusion",
        token     : "diffusion",
    },
    {
        text_token: "material.layer.fresnel",
        token     : "fresnel",
    },
    {
        text_token: "material.layer.fresnel.reverse",
        token     : "fresnel.reverse",
    },
    {
        text_token: "material.layer.normal",
        token     : "fresnel.normal",
    },
    {
        text_token: "material.layer.random",
        token     : "fresnel.random",
    },
    {
        text_token: "material.layer.texture",
        token     : "fresnel.texture",
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
    ComputePosition(ref_element, menu, 'auto', 5);
    return menu;
}