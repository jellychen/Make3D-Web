/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import GeometryTris from '@core/misc/geometry-tris';

/**
 * 
 * 修复
 * 
 * @param {*} mesh 
 */
export default function RepairMesh(mesh) {
    if (!mesh || !mesh.geometry) {
        return;
    }

    const tris = GeometryTris(mesh.geometry);
    if (!tris) {
        return;
    }

    const Chameleon = GlobalScope.Chameleon;
    const {
        GeoSolidSoupTriangulator,
        GeoSolidTrisRepair3dPrinter,
    } = Chameleon;

    const repair = GeoSolidTrisRepair3dPrinter.MakeShared();
    repair.setTris(tris);
    repair.tryRepair();
    const soup = repair.getResultSoup();

    tris  .delete();
    repair.delete();

    if (!soup) {
        return;
    }

    //
    // 新建
    //
    const new_mesh = new XThree.Mesh(new XThree.BufferGeometry());
    new_mesh.position  .setFromMatrixPosition(mesh.matrixWorld);
    new_mesh.quaternion.setFromRotationMatrix(mesh.matrixWorld);
    new_mesh.scale     .setFromMatrixScale   (mesh.matrixWorld);

    //
    // 设置几何
    //
    const indices  = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr()).slice();
    const vertices = soup.vertices().slice();
    new_mesh.geometry.setAttribute('position', new XThree.BufferAttribute(vertices, 3));
    new_mesh.geometry.setIndex(new XThree.BufferAttribute(indices, 1));

    soup.delete();

    return new_mesh;
}
