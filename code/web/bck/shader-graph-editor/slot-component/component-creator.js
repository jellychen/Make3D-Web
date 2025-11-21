/* eslint-disable no-unused-vars */

import In     from './port/in/v';
import Out    from './port/out/v';
import Bool_1 from './b1/v';

/**
 * 
 * 创建组件
 * 
 * @param {*} type 
 * @param {*} user_data 
 * @returns 
 */
export default function Create(type, ...args) {
    switch(type) {
    case 'port.in':
        return new In(...args);
    case 'port.out':
        return new Out(...args);

    case 'boolean':
        return new Boolean(...args);
    }
    return;
}
