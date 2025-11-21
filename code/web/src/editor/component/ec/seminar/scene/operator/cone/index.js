/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 默认值
 */
const DEFAULT_RADIUS    = 0.5;
const DEFAULT_HEIGHT    = 0.8;
const DEFAULT_SEGMENTS  = 16;

/**
 * Cone 
 */
export default class Cone extends Base {
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
    #height   = 0;
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
        this.#setter.setHeight(DEFAULT_HEIGHT);
        this.#setter.setSegments(DEFAULT_SEGMENTS);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.cone');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Cone - ${this.unique_id}`);
        
        // 更新几何
        this.#updateGeo(DEFAULT_SEGMENTS, DEFAULT_RADIUS, DEFAULT_HEIGHT);

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
        if (this.#segments == DEFAULT_SEGMENTS &&
            this.#radius   == DEFAULT_RADIUS   &&
            this.#height   == DEFAULT_HEIGHT) {
            return false;
        }

        this.#setter.setRadius  (DEFAULT_RADIUS  );
        this.#setter.setHeight  (DEFAULT_HEIGHT  );
        this.#setter.setSegments(DEFAULT_SEGMENTS);
        this.#updateGeo(DEFAULT_SEGMENTS, DEFAULT_RADIUS, DEFAULT_HEIGHT);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.segments, this.#setter.radius, this.#setter.height);
    }

    /**
     * 
     * 更新几何体
     * 
     * @param {*} n_subdivisions 
     * @param {*} radius 
     * @param {*} h 
     * @returns 
     */
    #updateGeo(n_subdivisions, radius, h) {
        if (this.#segments == n_subdivisions && 
            this.#radius   == radius && 
            this.#height   == h) {
            return;
        } else {
            this.#segments =  n_subdivisions;
            this.#radius   =  radius;
            this.#height   =  h;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Cone(
            soup.getPtr(), 
            n_subdivisions, 
            radius, 
            h);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}
