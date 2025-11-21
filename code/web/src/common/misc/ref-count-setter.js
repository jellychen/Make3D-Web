/* eslint-disable no-unused-vars */

import isObject from 'lodash/isObject';
import RefCount from './ref-count';

/**
 * 
 * 给对象添加引用计数
 * 
 * @param {*} object 
 * @param {*} init_ref_count 
 * @param {*} destructor 
 * @returns 
 */
export default function(object, init_ref_count = 1, destructor = undefined) {
    if (!object || !isObject(object) || object.__$$$_ref_count_$$$___) {
        return;
    }
    object.__$$$_ref_count_$$$___ 
        = new RefCount(object, init_ref_count, destructor);
    return object;   
} 
