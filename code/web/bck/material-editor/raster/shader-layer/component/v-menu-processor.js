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
        text_token: "material.layer.black.white",
        token     : "black.white",
    },
    {
        text_token: "material.layer.brown",
        token     : "brown",
    },
    {
        text_token: "material.layer.casting",
        token     : "casting",
    },
    {
        text_token: "material.layer.color.reset",
        token     : "color.reset",
    },
    {
        text_token: "material.layer.colorify",
        token     : "colorify",
    },
    {
        text_token: "material.layer.comic.strip",
        token     : "comic.strip",
    },
    {
        text_token: "material.layer.exposure",
        token     : "exposure",
    },
    {
        text_token: "material.layer.freeze",
        token     : "freeze",
    },
    {
        text_token: "material.layer.grey",
        token     : "grey",
    },
    {
        text_token: "material.layer.hue",
        token     : "hue",
    },
    {
        text_token: "material.layer.luminance",
        token     : "luminance",
    },
    {
        text_token: "material.layer.mean",
        token     : "mean",
    },
    {
        text_token: "material.layer.reminiscence",
        token     : "reminiscence",
    },
    {
        text_token: "material.layer.reverse",
        token     : "reverse",
    },
    {
        text_token: "material.layer.sepia",
        token     : "sepia",
    },
    {
        text_token: "material.layer.truncation",
        token     : "truncation",
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