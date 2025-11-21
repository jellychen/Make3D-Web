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
                const output = JSON.stringify(result);
                const blob = new Blob([output], { type: 'model/gltf+json' });
                resolve(blob);
            }, 
            (err) => {
                reject(new Error('inner error'));
            },
            {
                binary: false
            });
    });
    return promise;
}
