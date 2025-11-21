/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 常量
 */
const DEFAULT_RADIUS        = 1;
const DEFAULT_SEGMENT_COUNT = 3;

/**
 * 多边形
 */
export default class Polygon extends Base {
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
    #radius   = 0;
    #segments = 0;

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
        this.#setter.setSegments(DEFAULT_SEGMENT_COUNT);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.polygon');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Polygon - ${this.unique_id}`);

        // 更新几何
        this.#updateGeo(DEFAULT_RADIUS, DEFAULT_SEGMENT_COUNT);

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
        if (this.#segments == DEFAULT_SEGMENT_COUNT &&
            this.#radius   == DEFAULT_RADIUS) {
            return false;
        }
        this.#setter.setRadius(DEFAULT_RADIUS);
        this.#setter.setSegments(DEFAULT_SEGMENT_COUNT);
        this.#updateGeo(DEFAULT_RADIUS, DEFAULT_SEGMENT_COUNT);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.radius, this.#setter.segments);
    }

    /**
     * 
     * 更新几何体
     *  
     * @param {*} radius 
     * @param {*} segments_count 必须 >= 3
     * @returns 
     */
    #updateGeo(radius, segments_count) {
        if (this.#radius == radius && 
            this.#segments == segments_count) {
            return;
        } else {
            this.#radius = radius;
            this.#segments = segments_count;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Polygon(
            soup.getPtr(), 
            radius, 
            segments_count);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}
