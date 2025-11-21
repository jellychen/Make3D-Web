/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import Base         from '../base';

/**
 * blender susan
 */
export default class Susan extends Base {
    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * 
     * 构造函数
     * 
     * @param {*} ec 
     * @param {*} coordinator 
     * @param {*} assistor 
     */
    constructor(ec, coordinator, assistor) {
        super(ec, coordinator, assistor);
    }

    /**
     * 启动
     */
    start() {
        super.start();

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
            GeoSolidSoupTriangulator,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Susan(soup.getPtr());
        const triangles_indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Susan - ${this.unique_id}`);
        this.#mesh.setGeoVertices(soup.vertices(), true);
        this.#mesh.setGeoIndices32(triangles_indices, true);
        this.#mesh.computeVertexNormalsAndReserveAcuteAngle();
        this.#mesh.setEditableSoup(soup);

        // soup 销毁
        soup.delete();

        // 添加场景中
        this.scene.add(this.#mesh);
        this.historical_recorder.deleteMesh(this.#mesh);
        this.setDisposeRollbackMarker(this.historical_recorder.size());

        this.historical_recorder.beginGroup();
        this.historical_recorder.saveSelectorContainer();
        this.selected_container.replace(this.#mesh);
        this.historical_recorder.disposeManipulator();
        this.historical_recorder.endGroup();

        this.setObjectPositionAtOrbitTarget(this.#mesh);
        this.#mesh.updateWorldMatrix(true, false);
        this.coordinator.updateTransformer();
        this.coordinator.markTreeViewNeedUpdate(true);
        this.coordinator.renderNextFrame();

        // 开启面侦测
        this.startPlaneDetectorCauseofMesh(this.#mesh, this.keyboard_watcher.shift);
    }
}
