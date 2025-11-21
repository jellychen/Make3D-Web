/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree          from '@xthree/basic';
import { OBJExporter } from 'three/addons/exporters/OBJExporter';

/**
 * 
 * 导出 GLB
 * 
 * @param {*} mesh 
 */
export default function(mesh) {
    return new OBJExporter().parse(mesh);
}