/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import Coordinator  from './coordinator';

/**
 * Mixin
 */
Object.assign(Coordinator.prototype, {
    /**
     * 添加默认的元素
     */
    addDefaultElementsToScene() {
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
            GeoSolidSoupTriangulator,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Cube(
            soup.getPtr(),
            1,
            1,
            1);
        const triangles_indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());

        // 构建 Mesh Geo
        const mesh = new EditableMesh();
        mesh.setName(`Cube`);
        mesh.setGeoVertices(soup.vertices(), true);
        mesh.setGeoIndices32(triangles_indices, true);
        mesh.computeVertexNormalsAndReserveAcuteAngle();
        mesh.geoChanged();
        mesh.setEditableSoup(soup);
        soup.delete();
        this.scene.add(mesh);
        this.markTreeViewNeedUpdate(true);

        // 请求重绘
        this.renderNextFrame();
    }
});
