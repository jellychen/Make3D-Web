/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Export from '@core/cinderella/export';

/**
 * 
 * 下载指定的类型
 * 
 * @param {*} scene 
 * @param {*} type 
 */
export default function(scene, type='obj') {
    scene.updateMatrixWorld();
    switch (type) {
    case 'obj':
        Export.Downloader_OBJ(scene, "repaired.obj");
        break;

    case 'stl':
        Export.Downloader_STL(scene, "repaired.stl");
        break;
    };
}