/* eslint-disable no-unused-vars */

import isNumber        from 'lodash/isNumber';
import ComputePosition from '@common/misc/compute-position';
import ImageViewer     from './v';

/**
 * 
 * 显示图片
 * 
 * @param {*} image 
 * @param {*} reference_element 
 * @param {*} offset 
 * @param {*} dock 
 * @returns 
 */
export default function(image, reference_element, offset, dock = 'auto') {
    const viewer = new ImageViewer();
    viewer.setImage(image);
    document.body.appendChild(viewer);
    if (!isNumber(offset)) {
        offset = 0;
    }

    if (reference_element) {
        ComputePosition(reference_element, viewer.content, dock, offset);
    }

    return viewer;
}
