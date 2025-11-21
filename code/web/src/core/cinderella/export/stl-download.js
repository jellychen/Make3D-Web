/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import Exporter    from './stl';

/**
 * 
 * 导出 STL
 * 
 * @param {*} mesh 
 * @param {*} filename 
 * @returns 
 */
export default function(mesh, filename = "mesh.stl") {
    const data = Exporter(mesh);
    if (isUndefined(filename)) {
        return false;
    }

    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    return true;
}
