/* eslint-disable no-unused-vars */

import isArray from 'lodash/isArray';
import Isolate from './isolate';
import Picker  from './core/picker';

/**
 * 拾取器
 */
const picker = new Picker();

/**
 * 
 * 拾取
 * 
 * @param {*} isolate 
 * @param {*} ui_x 
 * @param {*} ui_y 
 * @returns 
 */
export default function(isolate, ui_x, ui_y) {
    const x = isolate.toNDC_X(ui_x);
    const y = isolate.toNDC_Y(ui_y);
    picker.setPickInfo(x, y, isolate.getCamera(), isolate, ui_x, ui_y);
    const selected = picker.pick(isolate.getScene());
    if (!selected || !isArray(selected) || 0 === selected.length) {
        return;
    } else {
        return selected[0].object;
    }
}
