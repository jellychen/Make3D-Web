/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 常量
 */
const DEFAULT_RADIUS = 0.5;

/**
 * Tetrahedron 
 */
export default class Tetrahedron extends Base {
    /**
     * 设置面板
     */
    #setter;

    /**
     * 操作的mesh
     */
    #mesh;

    /**
     * 当前的参数
     */
    #radius;

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

        // 设置窗口
        this.#setter = new Setter(this, () => this.#onSetterChanged());
        this.#setter.setRadius(DEFAULT_RADIUS);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.tetrahedron');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Tetrahedron - ${this.unique_id}`);
        
        // 更新几何
        this.#updateGeo(DEFAULT_RADIUS);

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

    /**
     * 重置到默认值
     */
    resetToDefault() {
        if (this.#radius == DEFAULT_RADIUS) {
            return false;
        }
        this.#setter.setRadius(DEFAULT_RADIUS);
        this.#updateGeo(DEFAULT_RADIUS);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.radius);
    }

    /**
     * 
     * 更新几何体
     * 
     * @param {Number} radius 
     */
    #updateGeo(radius) {
        if (this.#radius == radius) {
            return;
        } else {
            this.#radius =  radius;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Tetrahedron(
            soup.getPtr(),
            radius);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}
