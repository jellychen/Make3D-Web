/* eslint-disable no-unused-vars */

import isString            from 'lodash/isString';
import GlobalScope         from '@common/global-scope';
import XThree              from '@xthree/basic';
import ScopedParameters    from '@core/houdini/scoped-parameters';
import Base                from '../base';
import SelectorTransformer from './selector-transformer';

/**
 * 临时
 */
const _vec2_0 = new XThree.Vector2();
const _vec2_1 = new XThree.Vector2();
const _mat4_0 = new XThree.Matrix4();
const _mat4_1 = new XThree.Matrix4();
const _mat4_2 = new XThree.Matrix4();
const _mat4_3 = new XThree.Matrix4();

/**
 * 选择器
 * 
 * 点选依赖
 * 1. Occlusion Buffer
 * 2. MVP
 * 3. ViewportSize
 * 4. AnchorTolerance
 * 5. AnchorPoint
 * 6. Ray
 * 
 * 框选依赖
 * 1. Occlusion Buffer
 * 2. MVP
 * 3. Box
 * 
 */
export default class Selector extends Base {
    /**
     * 核心渲染器
     */
    #cinderella;

    /**
     * 键盘监控
     */
    #keyboard_watcher;

    /**
     * 角斗场, C++ wasm 接口
     */
    #connector;

    /**
     * 场景渲染
     */
    #arena;

    /**
     * 射线
     */
    #raycaster = new XThree.Raycaster();

    /**
     * 透视选取
     */
    #see_through;

    /**
     * 拾取的基元
     */
    #primitive = 'v';

    /**
     * 记录当前更新的相机的VP矩阵的版本
     */
    #current_camera_vp_version;

    /**
     * 深度维护者
     */
    #depth_buffer_maintainer;

    /**
     * 事件回调
     */
    #on_click              = event => this.#onClick(event);
    #on_dbclick            = event => this.#onDbClick(event);
    #on_box_select_begin   = event => this.#onBoxSelectBegin(event);
    #on_box_select_changed = event => this.#onBoxSelectChanged(event);
    #on_box_select_end     = event => this.#onBoxSelectEnd(event);
    #on_keydown            = event => this.#onKeyDown(event);
    #on_keyup              = event => this.#onKeyUp(event);

    /**
     * 调整变换组件
     */
    #selector_transformer;

    /**
     * 获取
     */
    get selector_transformer() {
        return this.#selector_transformer;
    }

    /**
     * 获取
     */
    get transformer() {
        return this.#selector_transformer;
    }

    /**
     * 获取
     */
    get selector_primitive() {
        return this.getSelectorPrimitive();
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} connector 
     * @param {*} arena 
     */
    constructor(coordinator, connector, arena) {
        if (!coordinator || !connector || !arena) {
            throw new Error("coordinator, connector or arena is invalid");
        }
        super(coordinator);
        this.#cinderella = coordinator.cinderella;
        this.#keyboard_watcher = this.#cinderella.getKeyboardWatcher();
        this.#connector = connector;
        this.#arena = arena;
        this.#depth_buffer_maintainer = arena.depth_buffer_maintainer;
        this.#selector_transformer = new SelectorTransformer(coordinator, connector, arena);
        this.setEnable(true);
        this.setSeeThrough(false);
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.interactive_controller.addEventListener('click'  ,               this.#on_click);
            this.interactive_controller.addEventListener('dbclick',               this.#on_dbclick);
            this.interactive_controller.addEventListener('box-select-begin',      this.#on_box_select_begin);
            this.interactive_controller.addEventListener('box-select-changed',    this.#on_box_select_changed);
            this.interactive_controller.addEventListener('box-select-end',        this.#on_box_select_end);
            this.#keyboard_watcher     .addEventListener('keydown',               this.#on_keydown);
            this.#keyboard_watcher     .addEventListener('keyup',                 this.#on_keyup);
        } else {
            this.interactive_controller.removeEventListener('click'  ,            this.#on_click);
            this.interactive_controller.removeEventListener('dbclick',            this.#on_dbclick);
            this.interactive_controller.removeEventListener('box-select-begin',   this.#on_box_select_begin);
            this.interactive_controller.removeEventListener('box-select-changed', this.#on_box_select_changed);
            this.interactive_controller.removeEventListener('box-select-end',     this.#on_box_select_end);
            this.#keyboard_watcher     .removeEventListener('keydown',            this.#on_keydown);
            this.#keyboard_watcher     .removeEventListener('keyup',              this.#on_keyup);
        }
    }

    /**
     * 
     * 设置变换矩阵
     * 
     * @param {*} mat4 
     */
    setMatrix(mat4) {
        this.#selector_transformer.setMatrix(mat4);
    }

    /**
     * 
     * 获取当前拾取的基元
     * 
     * V，E，F
     * 
     * @returns 
     */
    getSelectorPrimitive() {
        return this.#primitive;
    }

    /**
     * 
     * 是否开启透视
     * 
     * @returns 
     */
    isSeeThrough() {
        return this.#see_through;
    }

    /**
     * 
     * 是否开启透视选择
     * 
     * @param {Boolean} see_through 
     */
    setSeeThrough(see_through) {
        see_through = true == see_through;
        this.#see_through = see_through;
        this.#connector.setEnableSelectorSeeThrough(see_through);
    }

    /**
     * 
     * 设置选择的基元
     * 
     * @param {String} primitive 
     */
    setSelectorPrimitive(primitive) {
        if (!isString(primitive) || this.#primitive === primitive) {
            return;
        }

        // 配置
        const Chameleon = GlobalScope.Chameleon;
        const {
            AbattoirTopoPrimitive,
        } = Chameleon;

        // 设置选择点
        if ('v' === primitive || 'vertex' === primitive) {
            this.#primitive = 'v';
            this.#selector_transformer.setSelectorPrimitive(this.#primitive);
            this.#connector.setTopoPrimitive(AbattoirTopoPrimitive.V);
            this.#selector_transformer.update();
            return true;
        }

        // 设置选择边
        if ('e' === primitive || 'edge' === primitive) {
            this.#primitive = 'e';
            this.#selector_transformer.setSelectorPrimitive(this.#primitive);
            this.#connector.setTopoPrimitive(AbattoirTopoPrimitive.E);
            this.#selector_transformer.update();
            return true;
        }

        // 设置选择面
        if ('f' === primitive || 'face' === primitive) {
            this.#primitive = 'f';
            this.#selector_transformer.setSelectorPrimitive(this.#primitive);
            this.#connector.setTopoPrimitive(AbattoirTopoPrimitive.F);
            this.#selector_transformer.update();
            return true;
        }
    }

    /**
     * 取消选择全部
     */
    unselectAll() {
        if (this.#connector.unselectAll()) {
            this.#arena.markNeedUpdate();
        }
    }

    /**
     * 取消选择全部的点
     */
    unselectAllVertices() {
        if (this.#connector.unselectAllVertices()) {
            this.#arena.markNeedUpdate();
        }
    }

    /**
     * 取消选择全部的边
     */
    unselectAllEdges() {
        if (this.#connector.unselectAllEdges()) {
            this.#arena.markNeedUpdate();
        }
    }

    /**
     * 取消选择全部的面
     */
    unselectAllFaces() {
        if (this.#connector.unselectAllFaces()) {
            this.#arena.markNeedUpdate();
        }
    }

    /**
     * 
     * 更新视口尺寸
     * 
     * @returns 
     */
    #updateViewportSize() {
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        const p = this.#cinderella.pixel_ratio;
        ScopedParameters.setViewportSize(w, h, p);
        return this;
    }

    /**
     * 
     * 更新相机参数
     * 
     * @param {*} camera 
     */
    #updateCamera(camera) {
        this.#updateCameraFrustum(camera);
        this.#updateMatrix_VP(camera);
    }

    /**
     * 
     * 更新相机的视锥
     * 
     * @param {*} camera 
     * @returns 
     */
    #updateCameraFrustum(camera) {
        const n = camera.near;
        const f = camera.far;
        ScopedParameters.setFrustumNearAndFar(n, f);
        return this;
    }

    /**
     * 
     * 更新VP矩阵
     * 
     * @param {*} camera 
     * @returns 
     */
    #updateMatrix_VP(camera) {
        if (this.#current_camera_vp_version !== camera.version) {
            this.#current_camera_vp_version = camera.version;
            const p = camera.projectionMatrix;
            const v = camera.matrixWorldInverse;
            _mat4_0.multiplyMatrices(p, v);
            ScopedParameters.setVP(_mat4_0);
        }
        return this;
    }

    /**
     * 
     * 更新射线
     * 
     * @param {*} ray 
     * @returns 
     */
    #updateRay(ray) {
        ScopedParameters.setRay(ray);
        return this;
    }

    /**
     * 
     * 更新射线
     * 
     * @param {*} x UI 坐标系
     * @param {*} y 
     * @returns 
     */
    #updateRayFromPointer(x, y) {
        const camera = this.#cinderella.getCamera();
        const w = this.#cinderella.w;
        const h = this.#cinderella.h;
        _vec2_0.x = x / w * 2.0 - 1.0;
        _vec2_0.y = 1.0 - y / h * 2.0;
        this.#raycaster.setFromCamera(_vec2_0, camera);
        this.#updateRay(this.#raycaster.ray);
        return this;
    }

    /**
     * 捕获深度并同步读取
     */
    #depthBufferCaptureAndSyncReadBufferIfNeed() {
        //
        // 如果是透视拾取，不需要依赖深度图
        //
        if (this.#see_through) {
            return;
        } else {
            this.#depth_buffer_maintainer.captureAndSyncReadBufferIfNeed();
        }
    }

    /**
     * 
     * 点选
     * 
     * @param {*} event 
     */
    #onClick(event) {
        // UI坐标系
        const x = event.x;
        const y = event.y;

        //
        // 更新深度
        //
        // notice: 只有选择点和边才需要深度
        //
        if ('v' === this.#primitive || 'e' === this.#primitive) {
            this.#depthBufferCaptureAndSyncReadBufferIfNeed();
        }

        // 更新
        this.#updateViewportSize();
        this.#updateCamera(this.#cinderella.getCamera());
        this.#updateRayFromPointer(x, y);

        // 执行处理
        if (this.#connector.pointerSelect(x, y)) {
            this.#arena.markNeedUpdate();
            this.#selector_transformer.update();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 双击, 只有在选择边的时候才生效
     * 
     * @param {*} event 
     */
    #onDbClick(event) {
        if ('E' != this.#primitive && 'e' != this.#primitive) {
            return;
        }

        // 更新深度
        this.#depthBufferCaptureAndSyncReadBufferIfNeed();

        // 执行处理
        if (this.#connector.cherryPick()) {
            this.#arena.markNeedUpdate();
            this.#selector_transformer.update();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 框选开始
     * 
     * @param {*} event 
     */
    #onBoxSelectBegin(event) {
        //
        // 更新深度
        //
        // notice: 点线面都需要
        //
        if ('v' === this.#primitive || 
            'e' === this.#primitive || 
            'f' === this.#primitive) {
            this.#depthBufferCaptureAndSyncReadBufferIfNeed();
        }
    }

    /**
     * 
     * 框选
     * 
     * @param {*} event 
     */
    #onBoxSelectChanged(event) { }

    /**
     * 
     * 框选 = NDC 坐标系下
     * 
     * @param {*} event 
     */
    #onBoxSelectEnd(event) {
        // 更新
        this.#updateViewportSize();
        this.#updateCamera(this.#cinderella.getCamera());

        // 调用wasm执行框选
        const x0 = event.x0;
        const y0 = event.y0;
        const x1 = event.x1;
        const y1 = event.y1;
        if (this.#connector.boxSelected(x0, y0, x1, y1)) {
            this.#arena.markNeedUpdate();
            this.#selector_transformer.update();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 扩展已经选择的面
     * 
     * @returns 
     */
    #enlargeSelectedFaces() {
        if ('f' != this.#primitive && 'F' != this.#primitive) {
            return;
        }

        if (this.#connector.enlargeSelectedFaces()) {
            this.#arena.markNeedUpdate();
            this.#selector_transformer.update();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 缩小已经选择的面
     * 
     * @returns 
     */
    #shrinkSelectedFaces() {
        if ('f' != this.#primitive && 'F' != this.#primitive) {
            return;
        }

        if (this.#connector.shrinkSelectedFaces()) {
            this.#arena.markNeedUpdate();
            this.#selector_transformer.update();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 键盘按下
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        //
        // 如果在面模式下
        //
        // 按下 Shift+ / Shift- 进行加减免
        //
        if ('f' == this.#primitive || 'F' == this.#primitive) {
            if (!this.#keyboard_watcher.shift) {
                return;
            }

            // 按下 + / =
            if ('+' === event.key || '=' === event.key) {
                this.#enlargeSelectedFaces();
            }

            // 按下 - / _
            if ('-' === event.key || '_' === event.key) {
                this.#shrinkSelectedFaces();
            }
        }
    }

    /**
     * 
     * 键盘弹起
     * 
     * @param {*} event 
     */
    #onKeyUp(event) { }

    /**
     * 
     * 判断变换器是不是启用了
     * 
     * @returns 
     */
    isSelectorTransformerEnable() {
        return this.#selector_transformer.enable;
    }

    /**
     * 
     * 设置变换器是不是启用了
     * 
     * @param {boolean} enable 
     */
    setSelectorTransformerEnable(enable) {
        this.#selector_transformer.setEnable(true == enable);
    }
    
    /**
     * 更新变换
     */
    updateSelectorTransformerIfEnable() {
        this.#selector_transformer.update();
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        super.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.setEnable(false);
        this.#selector_transformer.dispose();
    }
}
