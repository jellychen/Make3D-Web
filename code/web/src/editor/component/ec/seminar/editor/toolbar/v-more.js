/* eslint-disable no-unused-vars */

import ShowMore_V from './more/menu-vertex';
import ShowMore_E from './more/menu-edge';
import ShowMore_F from './more/menu-face';

/**
 * 
 * 显示菜单
 * 
 * @param {*} coordinator 
 * @param {*} host 
 * @param {*} mode 
 * @param {*} reference_element 
 */
export default function ShowMore(coordinator, host, mode, reference_element = undefined) {
    switch (mode) {
    case 'v':
        return ShowMore_V(coordinator, host, reference_element);
    case 'e':
        return ShowMore_E(coordinator, host, reference_element);
    case 'f':
        return ShowMore_F(coordinator, host, reference_element);
    }
}
