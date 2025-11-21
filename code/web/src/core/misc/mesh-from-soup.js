/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';

/**
 * 
 * 从 Soup 中获取数据
 * 
 * @param {*} mesh 
 * @param {*} soup 
 * @param {*} organization 
 * @returns 
 */
export default function(mesh, soup, organization=true) {
    const Chameleon = GlobalScope.Chameleon;
    const {
        GeoSolidSoupTriangulator,
    } = Chameleon;

    // 三角化
    const triangles_indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());

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
    mesh.setGeoVertices(soup.vertices(), true);
    mesh.setGeoIndices32(triangles_indices, true);

    // 对几何体进行硬边保护
    if (organization) {
        mesh.computeVertexNormalsAndReserveAcuteAngle(mesh.crease_angle);
    } else {
        mesh.crease_angle = 0.001;
    }
    
    mesh.geoChanged();
    mesh.setEditableSoup(soup);

    return mesh;
}
