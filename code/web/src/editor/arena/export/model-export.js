
import Export from '@core/cinderella/export';

/**
 * 
 * 下载指定类型
 * 
 * @param {*} type 
 * @param {*} scene 
 * @param {*} success 
 * @param {*} fail 
 */
export default function(type, scene, success, fail) {
    scene.updateMatrixWorld();
    switch (type) {
        case 'obj':
            Export.Downloader_OBJ(scene, success, fail, "scene.obj");
            break;

        case 'gltf':
            Export.Downloader_GLTF(scene, success, fail, "scene.gltf");
            break;

        case 'glb':
            Export.Downloader_GLB(scene, success, fail, "scene.glb");
            break;

        case 'stl':
            Export.Downloader_STL(scene, success, fail, "scene.stl");
            break;

        case 'usdz':
            Export.Downloader_USDZ(scene, success, fail, "scene.usdz");
            break;
    }
}
