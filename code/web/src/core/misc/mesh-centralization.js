/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

//
// 临时
//
const vec3_0 = new XThree.Vector3();

/**
 * 
 * 对指定的object，挪动到中心
 * 
 * @param {*} object 
 */
export default function(object) {
    vec3_0.copy(object.position);
    object.position.set(0, 0, 0);
    object.updateMatrix();
    for (const child of object.children) {
        child.position.add(vec3_0);
        child.updateMatrix();
    }
}
