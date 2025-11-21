/* eslint-disable no-unused-vars */

import {
    offset,
    autoPlacement,
    computePosition
} from '@floating-ui/dom';

// https://floating-ui.com/docs/migration

/**
 * 
 * float_element 依附在 reference_element 附近
 * 
 * @param {*} reference_element 
 * @param {*} float_element 
 * @param {*} placement
 * @param {*} offset
 * @param {Boolean} atonce 表示是不是立刻
 * @param {Function} on_position 计算回调
 * 
 * 'auto'
 * 
 * 'top'
 * 'top-start'
 * 'top-end'
 * 'right'
 * 'right-start'
 * 'right-end'
 * 'bottom'
 * 'bottom-start'
 * 'bottom-end'
 * 'left'
 * 'left-start'
 * 'left-end'
 * 
 */
export default function(reference_element, 
                        float_element, 
                        placement   = 'right', 
                        offset_     = 10,
                        atonce      = true,
                        on_position = undefined) {
    if ('auto' === placement) {
        computePosition(reference_element, float_element, {
            middleware: [autoPlacement(), offset(offset_)],
        }).then(({x, y}) => {
            if (atonce) {
                Object.assign(float_element.style, {
                    left: `${x}px`,
                    top:  `${y}px`,
                });
            }

            if (on_position) {
                on_position(x, y);
            }
        });
    } else {
        computePosition(reference_element, float_element, {
            placement,
            middleware: [offset(offset_)],
        }).then(({x, y}) => {
            if (atonce) {
                Object.assign(float_element.style, {
                    left: `${x}px`,
                    top:  `${y}px`,
                });
            }
            
            if (on_position) {
                on_position(x, y);
            }
        });
    }
}
