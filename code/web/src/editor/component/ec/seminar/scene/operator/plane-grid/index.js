/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 常量
 */
const DEFAULT_W         = 2;
const DEFAULT_H         = 2;
const DEFAULT_W_SEGMENT = 2;
const DEFAULT_H_SEGMENT = 2;

/**
 * 平面网格
 */
export default class PlaneGrid extends Base {
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
    #w;
    #h;
    #w_segments;
    #h_segments;

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
        this.#setter.setW(DEFAULT_W);
        this.#setter.setH(DEFAULT_H);
        this.#setter.set_V_Segments(DEFAULT_W_SEGMENT);
        this.#setter.set_H_Segments(DEFAULT_H_SEGMENT);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.plane.grid');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`PlaneGrid - ${this.unique_id}`);

        // 更新几何
        this.#updateGeo(DEFAULT_W, DEFAULT_H, DEFAULT_W_SEGMENT, DEFAULT_H_SEGMENT);
        
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
        if (this.#w          == DEFAULT_W &&
            this.#h          == DEFAULT_H &&
            this.#w_segments == DEFAULT_W_SEGMENT &&
            this.#h_segments == DEFAULT_H_SEGMENT) {
            return false;
        }

        this.#setter.setW(DEFAULT_W);
        this.#setter.setH(DEFAULT_H);
        this.#setter.set_V_Segments(DEFAULT_W_SEGMENT);
        this.#setter.set_H_Segments(DEFAULT_H_SEGMENT);
        this.#updateGeo(DEFAULT_W, DEFAULT_H, DEFAULT_W_SEGMENT, DEFAULT_H_SEGMENT);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.w, 
                        this.#setter.h,
                        this.#setter.h_segments,
                        this.#setter.v_segments);
    }

    /**
     * 
     * 更新几何体
     * 
     * @param {number} w 
     * @param {number} h 
     * @param {number} h_segments 
     * @param {number} v_segments 
     */
    #updateGeo(w, h, h_segments, v_segments) {
        if (this.#w          == w &&
            this.#h          == h &&
            this.#w_segments == h_segments &&
            this.#h_segments == v_segments) {
            return false;
        } else {
            this.#w          =  w;
            this.#h          =  h;
            this.#w_segments =  h_segments;
            this.#h_segments =  v_segments;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.PlaneGrid(
            soup.getPtr(), 
            w, 
            h, 
            h_segments, 
            v_segments);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}
