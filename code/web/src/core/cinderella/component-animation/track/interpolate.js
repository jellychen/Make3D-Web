/* eslint-disable no-unused-vars */

import isNumber from 'lodash/isNumber';
import XThree   from '@xthree/basic';

/**
 * 临时
 */
const t = new XThree.Vector3();
const r = new XThree.Quaternion();
const s = new XThree.Vector3(1, 1, 1);

/**
 * 
 * 插值并映射
 * 
 * @param {*} item_a 
 * @param {*} item_b 
 * @param {*} interpolate 
 * @param {*} object 
 */
export default function(item_a, item_b, interpolate, object) {
    if (!isNumber(interpolate)) {
        return;
    }

    t.x = item_a.t.x + (item_b.t.x - item_a.t.x) * interpolate;
    t.y = item_a.t.y + (item_b.t.y - item_a.t.y) * interpolate;
    t.z = item_a.t.z + (item_b.t.z - item_a.t.z) * interpolate;
    s.x = item_a.s.x + (item_b.s.x - item_a.s.x) * interpolate;
    s.y = item_a.s.y + (item_b.s.y - item_a.s.y) * interpolate;
    s.z = item_a.s.z + (item_b.s.z - item_a.s.z) * interpolate;
    r.copy(item_a.r);
    r.slerp(item_b.r, interpolate);
    
    object.position  .copy(t);
    object.quaternion.copy(r);
    object.scale     .copy(s);
}
