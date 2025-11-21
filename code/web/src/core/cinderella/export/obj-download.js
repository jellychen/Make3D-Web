/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString from 'lodash/isString';
import Exporter from './obj';

/**
 * 
 * 导出 OBJ
 * 
 * @param {*} mesh 
 * @param {*} filename 
 * @returns 
 */
export default function(mesh, filename = "mesh.obj") {
    const str = Exporter(mesh);
    if (!isString(str)) {
        return false;
    }

    const blob = new Blob([str], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    return true;
}
