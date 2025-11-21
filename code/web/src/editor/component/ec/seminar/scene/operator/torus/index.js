/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Base         from '../base';
import Setter       from './v-setter';

/**
 * 常量
 */
const DEFAULT_R0           = 0.5;
const DEFAULT_R1           = 0.1;
const DEFAULT_SUBDIVISIONS = 64;
const DEFAULT_STEPS        = 16;
const DEFAULT_ANGLE_START  = 0;
const DEFAULT_ANGLE_END    = 360;

/**
 * Torus  
 */
export default class Torus extends Base {
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
    #r0;
    #r1;
    #subdivisions;
    #steps;
    #angle_start;
    #angle_end;

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
        this.#setter.setR0(DEFAULT_R0);
        this.#setter.setR1(DEFAULT_R1);
        this.#setter.setSubdivisions(DEFAULT_SUBDIVISIONS);
        this.#setter.setSteps(DEFAULT_STEPS);
        this.#setter.setAngleStart(DEFAULT_ANGLE_START);
        this.#setter.setAngleEnd(DEFAULT_ANGLE_END);
        this.setting_panel_container.setContent(this.#setter);
        this.setting_panel_container.setHeaderDefault('shape.cone');
        this.deferDestory(() => this.#setter.dispose());

        // 构建 Mesh
        this.#mesh = new EditableMesh();
        this.#mesh.setName(`Torus - ${this.unique_id}`);

        // 更新几何
        this.#updateGeo(DEFAULT_R0, 
                        DEFAULT_R1, 
                        DEFAULT_SUBDIVISIONS, 
                        DEFAULT_STEPS, 
                        DEFAULT_ANGLE_START, 
                        DEFAULT_ANGLE_END);

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
        if (this.#r0           == DEFAULT_R0 &&
            this.#r1           == DEFAULT_R1 &&
            this.#subdivisions == DEFAULT_SUBDIVISIONS &&
            this.#steps        == DEFAULT_STEPS &&
            this.#angle_start  == DEFAULT_ANGLE_START &&
            this.#angle_end    == DEFAULT_ANGLE_END) {
            return;
        }

        this.#setter.setR0(DEFAULT_R0);
        this.#setter.setR1(DEFAULT_R1);
        this.#setter.setSubdivisions(DEFAULT_SUBDIVISIONS);
        this.#setter.setSteps(DEFAULT_STEPS);
        this.#setter.setAngleStart(DEFAULT_ANGLE_START);
        this.#setter.setAngleEnd(DEFAULT_ANGLE_END);
        this.#updateGeo(DEFAULT_R0, 
                        DEFAULT_R1, 
                        DEFAULT_SUBDIVISIONS, 
                        DEFAULT_STEPS, 
                        DEFAULT_ANGLE_START, 
                        DEFAULT_ANGLE_END);
        return true;
    }

    /**
     * 设置器值修改
     */
    #onSetterChanged() {
        this.#updateGeo(this.#setter.r0,
                        this.#setter.r1,
                        this.#setter.subdivisions,
                        this.#setter.steps,
                        this.#setter.angleStart,
                        this.#setter.angleEnd);
    }

    /**
     * 
     * 构建Geo
     * 
     * @param {*} r0 
     * @param {*} r1 
     * @param {*} n_subdivisions 
     * @param {*} n_steps 
     * @param {*} angle_start 
     * @param {*} angle_end 
     */
    #updateGeo(r0, r1, n_subdivisions, n_steps, angle_start, angle_end) {
        if (this.#r0           == r0 &&
            this.#r1           == r1 &&
            this.#subdivisions == n_subdivisions &&
            this.#steps        == n_steps &&
            this.#angle_start  == angle_start &&
            this.#angle_end    == angle_end) {
            return;
        } else {
            this.#r0           =  r0;
            this.#r1           =  r1;
            this.#subdivisions =  n_subdivisions;
            this.#steps        =  n_steps;
            this.#angle_start  =  angle_start;
            this.#angle_end    =  angle_end;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
            GeoSolidSoupEmbeddedShapes,
        } = Chameleon;

        // 构建SOUP，并在上面构建平面，然后三角化
        const soup = GeoSolidSoup.MakeShared();
        GeoSolidSoupEmbeddedShapes.Torus(
            soup.getPtr(), 
            r0, 
            r1, 
            n_subdivisions, 
            n_steps, 
            angle_start, 
            angle_end);

        // 转Mesh
        MeshFromSoup(this.#mesh, soup);

        // 销毁
        soup.delete();

        // 下一帧渲染
        this.renderNextFrame();
    }
}

