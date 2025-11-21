/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';

/**
 * 
 * 从 Tris 中获取数据
 * 
 * @param {*} mesh 
 * @param {*} soup 
 * @param {*} tris 
 * @returns 
 */
export default function(mesh, soup, tris) {
    //
    // 为了兼容webgpu
    //
    // webgpu中几何只能初始化一次
    //
    if (mesh) {
        mesh.rebuildNewEmptyGeometry();
    } else {
        mesh = new EditableMesh();
    }

    // 设置几何数据
    mesh.setGeoVertices(tris.vertices(), true);
    mesh.setGeoIndices32(tris.indices(), true);
    mesh.computeVertexNormalsAndReserveAcuteAngle(mesh.crease_angle);
    mesh.geoChanged();
    mesh.setEditableSoup(soup);

    return mesh;
}
