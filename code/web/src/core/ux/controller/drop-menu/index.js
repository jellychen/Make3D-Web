/* eslint-disable no-unused-vars */

import isFunction      from 'lodash/isFunction';
import cloneDeep       from 'lodash/cloneDeep';
import DropMenuContext from './v-context';
import DropMenu        from './v';

/**
 * 
 * 打开新的菜单
 * 
 * @param {*} data                  数据
 * @param {function} on_selected    点击
 * @param {function} on_cancle      取消
 * @param {*} show                  立刻显示
 * @param {*} animation             带有动画
 * @param {*} x                     x
 * @param {*} y                     y
 * @param {*} reference_element     依附的元素
 * @param {*} placement             放置位置
 * @param {*} style                 样式
 * @returns 
 */
export default function(data,
                        on_selected = undefined,
                        on_cancle = undefined,
                        show = true,
                        animation = true,
                        x = 0,
                        y = 0,
                        reference_element = undefined, 
                        placement = 'right',
                        style = 'normal') {
    data = data || {};
    data = cloneDeep(data);

    // 新建
    const menu_context = new DropMenuContext();
    menu_context.style = style;
    menu_context.animation = animation;

    // 回调函数
    if (isFunction(on_selected)) {
        menu_context.on_selected = on_selected;
    }

    if (isFunction(on_cancle)) {
        menu_context.on_cancle = on_cancle;
    }

    // 新建菜单
    const menu = new DropMenu(menu_context);

    // 设置数据
    menu.setData(data);

    // 显示菜单
    if (show) {

        // 添加到Dom
        menu.show();

        // 摆放
        if (reference_element) {
            placement = placement || 'auto';
            menu.place(reference_element, placement);
        } else {
            menu.placeLocation(x, y);
        }
    }
    
    return menu;
}
