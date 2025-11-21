/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 常量
 */
const DEFAULT_RADIUS = 1;
const DEFAULT_SLICES = 24;
const DEFAULT_STACKS = 16;

/**
 * Sphere 
 */
export default class Sphere extends Base {
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
    #slices;
    #stacks;

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
        this.#setter.setSlices(DEFAULT_SLICES);
        this.#setter.setStacks(DEFAULT_STACKS);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.cone');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Sphere - ${this.unique_id}`);

        // 更新几何
        this.#updateGeo(DEFAULT_RADIUS, DEFAULT_SLICES, DEFAULT_STACKS);

        // 添加场景中 更新选择集
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
        if (this.#radius == DEFAULT_RADIUS &&
            this.#slices == DEFAULT_SLICES   &&
            this.#stacks == DEFAULT_STACKS) {
            return false;
        }

        this.#setter.setRadius(DEFAULT_RADIUS);
        this.#setter.setSlices(DEFAULT_SLICES);
        this.#setter.setStacks(DEFAULT_STACKS);
        this.#updateGeo(DEFAULT_RADIUS, DEFAULT_SLICES, DEFAULT_STACKS);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.radius, this.#setter.slices, this.#setter.stacks);
    }

    /**
     * 
     * 构建Geo
     * 
     * @param {*} radius 
     * @param {*} n_slices 
     * @param {*} n_stacks 
     */
    #updateGeo(radius, n_slices, n_stacks) {
        if (this.#radius == radius   &&
            this.#slices == n_slices &&
            this.#stacks == n_stacks) {
            return;
        } else {
            this.#radius =  radius;
            this.#slices =  n_slices;
            this.#stacks =  n_stacks;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Sphere(
            soup.getPtr(),
            radius,
            n_slices,
            n_stacks);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}
