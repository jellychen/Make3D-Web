/* eslint-disable no-unused-vars */

import Bundle    from './bundle/v';
import Model     from './model/v';
import Printer3D from './printer-3d/v';

/**
 * 
 * 获取
 * 
 * @param {*} coordinator 
 * @param {*} cls 
 * @returns 
 */
export default function(coordinator, cls) {
    switch(cls) {
        case 'model':
            return new Model(coordinator);
        case 'printer3d':
            return new Printer3D(coordinator);
        case 'bundle':
            return new Bundle(coordinator);
    }
    return;
}