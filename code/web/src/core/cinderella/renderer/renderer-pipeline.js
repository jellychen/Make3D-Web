/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction                 from 'lodash/isFunction';
import XThree                     from '@xthree/basic';
import EventDispatcher            from '@common/misc/event-dispatcher';
import Coordinate                 from '../controller/coordinate';
import Outline                    from '../controller/outline';
import EdgeEnhancement            from '../controller/edge-enhancement';
import SelectBox                  from '../controller/select-box';
import Cursor                     from '../controller/cursor';
import Localizer                  from '../controller/localizer';
import Haft                       from '../controller/haft';
import Transformer                from '../controller/transformer';
import PlaneDetector              from '../controller/plane-detector';
import Copy                       from '../controller/copy';
import Layer                      from './layer';
import RendererPostprocess        from './renderer-postprocess';
import RendererPostprocessBuffers from './renderer-postprocess-buffers';
import SubtreeRoots               from './subtree-roots';

/**
 * 渲染管线
 */
export default class RendererPipeline extends EventDispatcher {
    /**
     * 用来统计性能的时钟
     */
    #clock = new XThree.Clock(false);

    /**
     * 需要渲染的尺寸
     */
    #pixel_ratio = 1.0;
    #w           = 0;
    #h           = 0;

    /**
     * 核心
     */
    #isolate;
    #isolate_html_dom;
    #renderer;
    #orbit;
    #personal_cameraman;
    #camera;

    /**
     * 灯光容器
     */
    #light_associate_container;

    /**
     * 场景
     */
    #scene;
    #scene_enable_shadow = true;
    #scene_collaborator;

    /**
     * 用来绘制outline
     */
    #scene_outline       = new XThree.Scene();
    #scene_subtree_roots = new SubtreeRoots();

    /**
     * 外部定义控件
     */
    #outlet_controller;

    /**
     * 覆盖场景
     */
    #override_scene;

    /**
     * 场景渲染掩码
     */
    #scene_render_layer_mask;
    
    /**
     * 交互
     */
    #coordinate = new Coordinate();
    #selectbox;
    #cursor;
    #localizer;
    #haft;
    #transformer;
    #plane_detector;

    /**
     * 上屏
     */
    #copy;

    /**
     * 描边
     */
    #outline_highlight;
    #outline;

    /**
     * 边缘增强
     */
    #edge_enhancement;
    
    /**
     * 后处理+双缓冲
     */
    #postprocess_buffers = new RendererPostprocessBuffers();
    #postprocess = new RendererPostprocess(this.#postprocess_buffers);

    /**
     * 标志位
     */
    #enable_render_scene      = true ; // 开启在编模型的独立显示
    #enable_lights            = true ; // 开启灯光的支持
    #enable_coordinate        = true ; // 绘制坐标
    #enable_cursor            = false; // 渲染游标
    #enable_localizer         = false; // 显示游标
    #enable_plane_detector    = false; // 面侦测
    #enable_transformer       = true ; // 全局开关
    #enable_outline_highlight = false; // 绘制高亮描边
    #enable_outline           = false; // 绘制描边
    #enable_edge_enhancement  = true ; // 边缘增强
    #enable_postprocess       = true ; // 后处理开关

    /**
     * 像素比
     */
    get pixelRatio() {
        return this.#pixel_ratio;
    }

    /**
     * 获取宽度
     */
    get w() {
        return this.#w;
    }

    /**
     * 获取高度
     */
    get h() {
        return this.#h;
    }

    /**
     * 获取场景
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 获取描边的子树
     */
    get outline_scene_subtree() {
        return this.#scene_subtree_roots;
    }

    /**
     * 获取相机
     */
    get camera() {
        return this.#personal_cameraman.camera;
    }

    /**
     * 获取坐标系
     */
    get coordinate() {
        return this.#coordinate;
    }

    /**
     * 获取游标
     */
    get cursor() {
        return this.#cursor;
    }

    /**
     * 获取游标
     */
    get localizer() {
        return this.#localizer;
    }

    /**
     * 获取选择框
     */
    get selectbox() {
        return this.#selectbox;
    }

    /**
     * 获取拖动柄
     */
    get haft() {
        return this.#haft;
    }

    /**
     * 获取变换组件
     */
    get transformer() {
        return this.#transformer;
    }

    /**
     * 获取面侦测
     */
    get plane_detector() {
        return this.#plane_detector;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} isolate 
     * @param {*} renderer 
     * @param {*} interactive 
     * @param {*} scene 
     * @param {*} cameraman 
     * @param {*} orbit 
     */
    constructor(isolate, renderer, interactive, scene, cameraman, orbit) {
        super();

        const request_animation_frame   = () => this.requestAnimationFrame();
        this.#isolate                   = isolate;
        this.#light_associate_container = this.#isolate.getLightAssociateContainer();
        this.#isolate_html_dom          = interactive;
        this.#renderer                  = renderer;
        this.#personal_cameraman        = cameraman;
        this.#orbit                     = orbit;
        this.#scene                     = scene;
        this.#scene_collaborator        = scene.getCollaborator();

        // 不主动接管事件
        let own_event                   = false;

        // 游标
        this.#cursor                    = new Cursor(this.#orbit, request_animation_frame);
        this.#localizer                 = new Localizer(request_animation_frame);

        // 变换组件
        this.#transformer               = new Transformer(request_animation_frame, interactive, own_event);
        this.#transformer.setPersonalCameraman(cameraman);

        // 单方向拖柄
        this.#haft                      = new Haft(request_animation_frame, interactive, own_event);
        this.#haft.setPersonalCameraman(cameraman);

        // 独立的后处理Pass
        this.#outline_highlight         = new Outline(this.#renderer, 0xFF8A34);    // 高亮描边
        this.#outline                   = new Outline(this.#renderer, 0x06fa8c);    // 描边
        this.#edge_enhancement          = new EdgeEnhancement(this.#renderer);      // 边缘增强
        
        // 面侦测渲染
        this.#plane_detector            = new PlaneDetector(request_animation_frame);

        // 框选框
        this.#selectbox                 = new SelectBox(request_animation_frame, interactive, own_event);

        // 后处理上屏
        this.#copy                      = new Copy(renderer);
    }

    /**
     * 
     * 设置渲染场景的掩码
     * 
     * @param {*} mask 
     * @param {*} render_next_frame 
     * @returns 
     */
    setSceneRenderLayerMask(mask, render_next_frame = false) {
        if (this.#scene_render_layer_mask === mask) {
            return;
        }

        this.#scene_render_layer_mask = mask;
        if (true === render_next_frame) {
            this.requestAnimationFrame();
        }
    }

    /**
     * 
     * 设置覆盖的场景
     * 
     * @param {*} scene 
     */
    setOverrideScene(scene) {
        if (scene instanceof XThree.Scene) {
            if (this.#override_scene == scene) {
                return;
            }
            this.#override_scene = scene;
        } else {
            if (!this.#override_scene) {
                return;
            }
            this.#override_scene = undefined;
        }
        this.requestAnimationFrame();
    }

    /**
     * 
     * 设置渲染控件
     * 
     * @param {*} controller 
     */
    setOutletController(controller) {
        if (this.#outlet_controller === controller) {
            return;
        }
        this.#outlet_controller = controller;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否渲染场景
     * 
     * @returns 
     */
    isEnableRenderScene() {
        return this.#enable_render_scene;
    }

    /**
     * 
     * 是否开启场景渲染
     * 
     * @param {boolean} enable 
     */
    setEnableRenderScene(enable) {
        enable = true === enable;
        if (this.#enable_render_scene == enable) {
            return;
        }
        this.#enable_render_scene = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否开启灯光的支持
     * 
     * @returns 
     */
    isEnableLights() {
        return this.#enable_lights;
    }

    /**
     * 
     * 是否开启灯光的支持
     * 
     * @param {*} enable 
     */
    setEnableLights(enable) {
        enable = true === enable;
        if (this.#enable_lights == enable) {
            return;
        }
        this.#enable_lights = enable;
        this.requestAnimationFrame();
    }

    /**
     * 是否运行场景阴影
     */
    isEnableSceneShadow() {
        return this.#scene_enable_shadow;
    }

    /**
     * 
     * 开启或者关闭场景阴影
     * 
     * @param {boolean} enable 
     */
    setEnableSceneShadow(enable) {
        enable = true === enable;
        if (enable == this.#scene_enable_shadow) {
            return;
        }
        this.#scene_enable_shadow = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否开启游标渲染
     * 
     * @returns 
     */
    isEnableCursor() {
        return this.#enable_cursor;
    }
    
    /**
     * 
     * 渲染游标
     * 
     * @param {boolean} enable 
     */
    setEnableCursor(enable) {
        enable = true === enable;
        if (this.#enable_cursor == enable) {
            return;
        }
        this.#enable_cursor = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否开启游标渲染
     * 
     * @returns 
     */
    isEnableLocalizer() {
        return this.#enable_localizer;
    }

    /**
     * 
     * 渲染游标
     * 
     * @param {*} enable 
     */
    setEnableLocalizer(enable) {
        enable = true === enable;
        if (this.#enable_localizer == enable) {
            return;
        }
        this.#enable_localizer = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否开启坐标轴
     * 
     * @returns 
     */
    isEnableCoordinate() {
        return this.#enable_coordinate;
    }

    /**
     * 
     * 设置坐标轴
     * 
     * @param {boolean} enable 
     */
    setEnableCoordinate(enable) {
        enable = true === enable;
        if (this.#enable_coordinate == enable) {
            return;
        }
        this.#enable_coordinate = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否开启描边
     * 
     * @returns 
     */
    isEnableOutline() {
        return this.#enable_outline;
    }

    /**
     * 
     * 设置描边
     * 
     * @param {boolean} enable 
     */
    setEnableOutline(enable) {
        enable = true === enable;
        if (this.#enable_outline == enable) {
            return;
        }
        this.#enable_outline = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否允许描边高亮
     * 
     * @returns 
     */
    isEnableOutlineHighlight() {
        return this.#enable_outline_highlight;
    }

    /**
     * 
     * 设置描边高亮
     * 
     * @param {boolean} enable 
     */
    setEnableOutlineHighlight(enable) {
        enable = true === enable;
        if (this.#enable_outline_highlight == enable) {
            return;
        }
        this.#enable_outline_highlight = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 返回是不是允许后处理
     * 
     * @returns boolean
     */
    isEnablePostprocess() {
        return this.#enable_postprocess;
    }

    /**
     * 
     * 修改后处理
     * 
     * @param {boolean} enable 
     * @returns 
     */
    setEnablePostprocess(enable) {
        enable = true === enable;
        if (this.#enable_postprocess == enable) {
            return;
        }

        this.#enable_postprocess = enable;

        if (this.#postprocess && this.#postprocess.hasPostprocess) {
            this.requestAnimationFrame();
        }
    }

    /**
     * 
     * 是否开启边缘增强
     * 
     * @returns 
     */
    isEnableEdgeEnhancement() {
        return this.#edge_enhancement;
    }

    /**
     * 
     * 设置边缘增强
     * 
     * @param {Boolean} enable 
     */
    setEnableEdgeEnhancement(enable) {
        enable = true === enable;
        if (this.#enable_edge_enhancement == enable) {
            return;
        }
        this.#enable_edge_enhancement = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 获取全局的
     * 
     * @returns 
     */
    isEnableTransformerGlobal() {
        return this.#enable_transformer;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} enable 
     */
    setEnableTransformerGlobal(enable) {
        this.#enable_transformer = true == enable;
    }

    /**
     * 
     * 变换组件
     * 
     * @returns 
     */
    isEnableTransformer() {
        return this.#transformer.enable;
    }

    /**
     * 
     * 设置变换组件
     * 
     * @param {boolean} enable 
     */
    setEnableTransformer(enable) {
        this.#transformer.setEnable(enable);
    }

    /**
     * 
     * 获取
     * 
     * @returns 
     */
    isEnableHaft() {
        return this.#haft.enable;
    }

    /**
     * 
     * 设置
     * 
     * @param {boolean} enable 
     */
    setEnableHaft(enable) {
        this.#haft.setEnable(enable);
    }

    /**
     * 
     * 是否开启面侦测
     * 
     * @returns 
     */
    isEnablePlaneDetector() {
        return this.#enable_plane_detector;
    }

    /**
     * 
     * 设置
     * 
     * @param {boolean} enable 
     */
    setEnablePlaneDetector(enable) {
        enable = true === enable;
        if (enable == this.#enable_plane_detector) {
            return;
        }
        this.#enable_plane_detector = enable;
        this.requestAnimationFrame();
    }

    /**
     * 
     * 是否运行选择框
     * 
     * @returns 
     */
    isEnableSelectBox() {
        return this.#selectbox.enable;
    }

    /**
     * 
     * 设置选择框
     * 
     * @param {Boolean} enable 
     */
    setEnableSelectBox(enable) {
        this.#selectbox.setEnable(enable);
    }

    /**
     * 
     * 有没有后处理需要执行
     * 
     * @returns 
     */
    #hasPostprocess() {
        return this.#enable_postprocess && this.#postprocess.hasPostprocess();
    }

    /**
     * 开始渲染
     */
    #beginRender() {
        // 发送信号
        this.dispatchEvent('begin-render', this);

        // 更新数据
        this.#scene_subtree_roots.update();

        // 判别后处理
        if (this.#hasPostprocess()) {
            // aa 也算后处理的一种
            // 如果存在后处理的流程，最后上屏幕的Gamma矫正会在最后一步进行
            this.#renderer.setRenderTarget(this.#postprocess_buffers.writeRenderTarget);

            // 所以在后处理钱都输出线性颜色空间
            this.#renderer.setColorSpace_LINEAR();

        } else {
            // 如果不存在后处理流程
            this.#renderer.setRenderTarget(null);

            // 直接输出Gamma矫正后的颜色
            this.#renderer.setColorSpace_SRGB();
        }

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.group("__DEV_LOG_PERFORMANCE__");
            this.#clock.start();
        }

        // 灯光
        if (!this.#enable_lights) {
            this.#light_associate_container.bckAndSetLightHolderHidden();
        }

        this.#renderer.autoClear = false;
        this.#renderer.setClearAlpha(0);
        this.#renderer.setClearColor(0, 0, 0);
        this.#renderer.clear(true, true, true);
    }

    /**
     * 渲染协助者
     */
    #renderCollaborator() {
        // 渲染
        this.#camera.layers.enableAll();
        this.#scene_collaborator.render(this, this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderCollaborator ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 协助者 渲染完成
     */
    #afterRenderCollaborator() {
        ;
    }

    /**
     * 绘制场景
     */
    #renderScene() {
        if (!this.#enable_render_scene) {
            return;
        }

        // 重置相机参数
        const camera = this.#camera;
        
        // 设置掩码
        if (undefined != this.#scene_render_layer_mask) {
            camera.layers.mask = this.#scene_render_layer_mask;
        } else {
            camera.layers.enableAll();
        }
        
        // 执行渲染流程
        let scene = this.#scene;
        if (this.#override_scene) {
            scene = this.#override_scene;
        }

        // 配置阴影
        if (this.#scene_enable_shadow) {
            if (scene.forbidden_shadow) {
                this.#renderer.shadowMap.enabled =  false;
            } else {
                this.#renderer.shadowMap.enabled =  true;
            }
        }

        // onFrameBegin
        if (isFunction(scene.onFrameBegin)) {
            scene.onFrameBegin(this, this.#renderer, camera);
        }

        // beforeRender
        if (isFunction(scene.beforeRender)) {
            scene.beforeRender(this.#pixel_ratio, this.#w, this.#h);
        }

        // render
        if (isFunction(scene.render)) {
            scene.render(this.#renderer, camera);
        } else {
            this.#renderer.render(scene, camera);
        }

        // afterRender
        if (isFunction(scene.afterRender)) {
            scene.afterRender();
        }
        
        // onFrameEnd
        if (isFunction(scene.onFrameEnd)) {
            scene.onFrameEnd(this, this.#renderer, camera);
        }

        // 重置相机参数
        this.#renderer.shadowMap.enabled = false;
        
        // 输出性能日志
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderScene ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 场景绘制完成
     */
    #afterRenderScene() {
        // 默认是关闭阴影
        this.#renderer.shadowMap.enabled = false;

        // 重置相机
        this.#camera.layers.enableAll();
    }

    /**
     * 绘制描边开始
     */
    #renderScope() {
        if (!this.#enable_outline &&
            !this.#enable_outline_highlight &&
            !this.#enable_edge_enhancement) {
            return;
        }

        if (this.#enable_lights) {
            this.#light_associate_container.bckAndSetLightHolderHidden();
        }
    }

    /**
     * 绘制描边
     */
    #renderOutline() {
        if (!this.#enable_outline) {
            return;
        }

        // 元素
        const camera  = this.#camera;
        const scene   = this.#scene_outline;
        const subtree = this.#scene_subtree_roots.data;
        if (0 == subtree.size) {
            return;
        }

        // 准备数据
        camera.layers.enableAll();
        scene.matrixWorldAutoUpdate = false;
        for (const item of subtree) {
            scene.children.push(item);
        }
        this.#outline.render(scene, camera);
        scene.children.length = 0;

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderOutline ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制高亮描边
     */
    #renderOutlineHighlight() {
        if (!this.#enable_outline_highlight) {
            return;
        }

        // 重置相机
        const camera = this.#camera;
        camera.layers.disableAll();
        camera.layers.enable(Layer.HIGHLIGHT);

        // 渲染的scene
        let scene = this.#scene;
        if (this.#override_scene) {
            scene = this.#override_scene;
        }

        // 渲染
        const old_matrix_world_auto_update = scene.matrixWorldAutoUpdate;
        scene.matrixWorldAutoUpdate = false;
        this.#outline_highlight.render(scene, camera);
        scene.matrixWorldAutoUpdate = old_matrix_world_auto_update;

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderOutlineHighlight ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 渲染描边结束
     */
    #renderScopeFinish() {
        if (!this.#enable_outline &&
            !this.#enable_outline_highlight &&
            !this.#enable_edge_enhancement) {
            return;
        }

        if (this.#enable_lights) {
            this.#light_associate_container.restoreLightHolderVisible();
        }
    }

    /**
     * 绘制边缘增强
     */
    #renderEdgeEnhancement() {
        // 如果关闭了边缘增强，直接跳出
        if (!this.#enable_edge_enhancement) {
            return;
        }
        
        // 重置相机
        this.#camera.layers.enableAll();

        // 渲染的scene
        let scene = this.#scene;
        if (this.#override_scene) {
            scene = this.#override_scene;
        }

        // 由于在渲染场景的已经更新了矩阵
        const old_matrix_world_auto_update = scene.matrixWorldAutoUpdate;
        scene.matrixWorldAutoUpdate = false;
        this.#edge_enhancement.render(scene, this.#camera);
        scene.matrixWorldAutoUpdate = old_matrix_world_auto_update;

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderEdgeEnhancement ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 开始绘制辅佐信息
     */
    #beginRenderContoller() {
        // 重置相机
        this.#camera.layers.enableAll();

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("beginRenderContoller ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制游标
     */
    #renderCursor() {
        // 如果不渲染游标，直接跳出
        if (!this.#enable_cursor) {
            return;
        }

        // 渲染游标
        this.#cursor.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderCursor ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制游标
     */
    #renderLocalizer() {
        // 如果不渲染游标，直接跳出
        if (!this.#enable_localizer) {
            return;
        }

        // 渲染游标
        this.#localizer.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderLocalizer ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制坐标轴
     */
    #renderCoordinate() {
        // 如果不渲染坐标轴，直接跳出
        if (!this.#enable_coordinate) {
            return;
        }

        // 渲染坐标轴
        this.#coordinate.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderCoordinate ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制外部控件
     */
    #renderOutletController() {
        // 发送信号
        this.dispatchEvent('render-outlet-controller', this);

        // 执行渲染
        if (!this.#outlet_controller) {
            return;
        }

        const renderer = this.#renderer;
        const camera   = this.#camera;

        if (isFunction(this.#outlet_controller.onFrameBegin)) {
            this.#outlet_controller.onFrameBegin(this, renderer, camera);
        }

        if (isFunction(this.#outlet_controller.render)) {
            this.#outlet_controller.render(renderer, camera);
        } else {
            this.#renderer.render(this.#outlet_controller, camera);
        }

        if (isFunction(this.#outlet_controller.onFrameEnd)) {
            this.#outlet_controller.onFrameEnd(this, renderer, camera);
        }
    }

    /**
     * 绘制变换组件
     */
    #renderTransformer() {
        // 如果不渲染变换组件
        if (!this.#enable_transformer || !this.#transformer.enable) {
            return;
        }

        // 渲染辅助
        this.#transformer.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderTransform ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制拖动柄
     */
    #renderHaft() {
        // 如果不渲染拖动柄，直接跳出
        if (!this.#haft.enable) {
            return;
        }

        // 渲染
        this.#haft.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderHaft ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制面侦测
     */
    #renderPlaneDetector() {
        // 如果不渲染面侦测，直接跳出
        if (!this.#plane_detector.enable || !this.#enable_plane_detector) {
            return;
        }

        // 渲染
        this.#plane_detector.render(this.#renderer, this.#camera);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderPlaneDetector ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 绘制选择框
     */  
    #renderSelectBox() {
        // 如果不渲染选择框，直接跳出
        if (!this.#selectbox.enable) {
            return;
        }

        // 渲染
        this.#selectbox.render(this.#renderer);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderSelectBox ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 后处理
     */
    #renderPostprocessing() {
        // 如果没有后处理
        if (!this.#renderer || !this.#hasPostprocess()) {
            return;
        }

        // 渲染
        this.#postprocess.execute(this.#renderer);

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("renderPostprocessing ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 输出到屏幕上面
     */
    #output() {
        // 发送信号
        this.dispatchEvent('end-render', this);

        // 执行渲染
        if (this.#hasPostprocess()) {
            this.#postprocess_buffers.swapbuffers();
            this.#renderer.setRenderTarget(null);
            this.#renderer.setClearColor(0x0, 0);
            this.#renderer.clearColor();
            this.#renderer.clearDepth();

            this.#copy.setTexture(this.#postprocess_buffers.readRenderTexture);
            this.#copy.render();
        }

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            console.log("output ", this.#clock.getDelta() * 1000.0);
        }
    }

    /**
     * 结束绘制
     */
    #endRender() {
        // 发送信号
        this.dispatchEvent('finish-render', this);

        // 收尾重置
        this.#camera.layers.enableAll();

        // 恢复
        if (!this.#enable_lights) {
            this.#light_associate_container.restoreLightHolderVisible();
        }

        // 输出性能数据
        if (__DEV_LOG_PERFORMANCE__) {
            this.#clock.stop();
            console.groupEnd();
        }
    }

    /**
     * 
     * 大小发生变动的时候
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w           = width;
        this.#h           = height;
        this.#postprocess_buffers.resize(pixel_ratio, width, height);
        this.#outline            .resize(pixel_ratio, width, height);
        this.#edge_enhancement   .resize(pixel_ratio, width, height);
        this.#selectbox          .resize(pixel_ratio, width, height);
        this.#transformer        .resize(pixel_ratio, width, height);
        this.#cursor             .resize(pixel_ratio, width, height);
        this.#localizer          .resize(pixel_ratio, width, height);
    }

    /**
     * 绘制
     */
    render() {
        this.#renderer.info.reset();
        this.#camera = this.#personal_cameraman.camera;

        this.#beginRender();                // 初始化
        this.#renderCollaborator();         // 渲染辅助
        this.#afterRenderCollaborator();    // 渲染辅助完成
        this.#afterRenderScene();           // 渲染场景之后
        this.#renderScene();                // 渲染场景
        
        this.#renderCoordinate();           // 绘制坐标轴
        
        this.#renderScope();                // 渲染描边开始
        this.#renderEdgeEnhancement();      // 边缘增强
        this.#renderOutline();              // 指定元素描边
        this.#renderOutlineHighlight();     // 绘制高亮描边
        this.#renderScopeFinish();          // 渲染描边结束

        this.#renderPostprocessing();       // 进行后处理
        this.#beginRenderContoller();       // 
        this.#renderOutletController();     // 绘制外部组件
        this.#renderHaft();                 // 绘制拖动柄
        this.#renderPlaneDetector();        // 绘制面侦测
        this.#renderCursor();               // 绘制游标
        this.#renderLocalizer();            // 绘制游标
        this.#renderTransformer();          // 绘制
        this.#renderSelectBox();            // 绘制选择框
        this.#output();
        
        this.#endRender();                  // 收尾
    }

    /**
     * 立刻渲染
     */
    immediateRender() {
        this.#isolate.immediateRender();
    }

    /**
     * 请求一帧新的渲染
     */
    requestAnimationFrame() {
        this.#isolate.requestAnimationFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#postprocess_buffers.dispose();
        this.#copy.dispose();
        this.#plane_detector.dispose();
    }
}
