/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import Exporter   from './usdz';

/**
 * 
 * 导出 GLB
 * 
 * @param {*} mesh 
 * @param {*} success 
 * @param {*} fail 
 * @param {*} filename 
 */
export default function(
    mesh,
    success,
    fail,
    filename = "mesh.usdz") {
    Exporter(mesh)
        .then(blob => {
            if (!blob) {
                if (isFunction(fail)) {
                    fail();
                }
                return;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            if (isFunction(success)) {
                success();
            }
        })
        .catch(err => {
            if (isFunction(fail)) {
                fail();
            }
        });
}
