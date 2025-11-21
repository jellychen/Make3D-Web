/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter';

/**
 * 
 * 导出 GLB
 * 
 * @param {*} mesh 
 */
export default async function(mesh) {
    const exporter = new GLTFExporter();
    const promise = new Promise((resolve, reject) => {
        exporter.parse(
            mesh, 
            (result) => {
                if (result instanceof ArrayBuffer) {
                    const blob = new Blob(
                        [result], 
                        {
                            type: 'application/octet-stream'
                        });
                    resolve(blob);
                } else {
                    reject(new Error('format error'));
                }
            }, 
            (err) => {
                reject(new Error('inner error'));
            },
            {
                binary: true
            });
    });
    return promise;
}
