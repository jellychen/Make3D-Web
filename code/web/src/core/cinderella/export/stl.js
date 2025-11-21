/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree          from '@xthree/basic';
import { STLExporter } from 'three/addons/exporters/STLExporter';

/**
 * 
 * 导出 STL
 * 
 * @param {*} mesh 
 * @returns 
 */
export default function(mesh) {
    return new STLExporter().parse(mesh, { binary: true });
}
