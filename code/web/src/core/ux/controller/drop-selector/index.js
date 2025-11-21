/* eslint-disable no-unused-vars */

import cloneDeep           from 'lodash/cloneDeep';
import isFunction          from 'lodash/isFunction';
import DropSelectorContext from './v-context';
import DropSelector        from './v';

/**
 * 
 * 打开新的下拉选择器
 * 
 * @param {*} data 
 * @param {*} on_selected 
 * @param {*} parent_node               // 会插入的父亲
 * @param {*} reference_element         // 位置计算相对
 * @param {*} _placement 
 * @param {*} style 
 * @param {*} offset 
 * @returns 
 */
export default function(data,
                        on_selected = undefined,
                        parent_node = undefined, 
                        reference_element = undefined,
                        _placement = 'auto',
                        style = 'normal',
                        offset = 0) {
    data = data || [];
    data = cloneDeep(data);

    // 构建上下文
    const selector_context = new DropSelectorContext();

    // 回调函数
    if (isFunction(on_selected)) {
        selector_context.on_selected = on_selected;
    }
    
    // 新建
    const selector = new DropSelector(selector_context);
    selector.setData(data);

    // 设置风格
    selector.setStyle(style);

    // 显示
    selector.show(parent_node || document.body);

    // 自动定位
    if (reference_element) {
        selector.place(reference_element, _placement || "auto", offset || 0);
    }

    return selector;
}