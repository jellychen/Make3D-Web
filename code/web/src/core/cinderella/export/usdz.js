/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import { USDZExporter } from 'three/addons/exporters/USDZExporter';

/**
 * 
 * 导出 USDZ
 * 
 * @param {*} mesh 
 */
export default async function(mesh) {
    const buffer = await new USDZExporter().parseAsync(mesh);
    const blob = new Blob(
        [buffer], 
        {
            type: 'application/octet-stream'
        });
    return blob;
}
