/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import OperatingInstructions from './v';

/**
 * 
 * 显示操作指引
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function Show(coordinator) {
    const view = new OperatingInstructions();
    if (isUndefined(coordinator)) {
        document.body.appendChild(view);
    } else {
        coordinator.abattoir.container.appendChild(view);
    }
    return view;
}
