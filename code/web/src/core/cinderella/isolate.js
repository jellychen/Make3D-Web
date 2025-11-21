/* eslint-disable no-unused-vars */

import isFunction                   from 'lodash/isFunction';
import XThree                       from '@xthree/basic';
import EventDispatcher              from '@common/misc/event-dispatcher';
import KeyboardWatcher              from './basic/keyboard-watcher';
import InteractiveIsolate           from './interactive-isolate';
import Constants                    from './core/constants';
import Mixin                        from './core/mixin';
import Scene                        from './core/scene';
import Renderer                     from './renderer/renderer';
import RendererPipeline             from './renderer/renderer-pipeline';
import LayersAdapter                from './renderer/layers-adapter';
import CameraCreator                from './core/camera/creator';
import LightSupervisor              from './core/light/supervisor';
import Loader                       from './loader';
import Orbit                        from './controller/orbit';
import PersonalCameraman            from './controller/personal-cameraman';
import                                   './isolate-ref-count';
import IsolateConfContext           from './isolate-conf-context';
import IsolateInteractiveController from './isolate-interactive-controller';

/**
 * 临时变量
 */
const VEC2_0      = new XThree.Vector2();
const RAYCASTER_0 = new XThree.Raycaster();

/**
 * 控制器
 */
export default class Isolate extends EventDispatcher {
    /**
     * Dom元素
     */
    #html_canvas;

    /**
     * Dom元素的代理
     */
    #interactive_proxy;

    /**
     * 是否初始化化
     */
    #inited = false;

    /**
     * 键盘监控
     */
    #keyboard_watcher = new KeyboardWatcher();

    /**
     * DOM属性
     */
    #pixel_ratio = 1.0;
    #w = 0;
    #h = 0;

    /**
     * 渲染器，场景，摄影师
     */
    #renderer;
    #scene;
    #renderer_pipeline;
    #renderer_first_resize = true;
    #renderer_request_animation_frame_id;

    /**
     * 渲染Layer控制
     */
    #layers_adapter;

    /**
     * 相机构建
     */
    #camera_creator;

    /**
     * 灯光构建
     */
    #light_supervisor;
    #light_associate_container;

    /**
     * 交互
     */
    #personal_cameraman;
    #orbit;

    /**
     * 设置和交互设置
     */
    #conf_context;

    /**
     * 交互控制器
     */
    #interactive_controller;

    /**
     * 渲染相关
     */
    #is_waitting_render = false;    // 标记是不是正在等待下一帧的渲染
    #is_rendering       = false;    // 正在渲染中

    /**
     * 获取
     */
    get pixel_ratio() {
        return this.#pixel_ratio;
    }

    /**
     * 获取
     */
    get w() {
        return this.#w;
    }
    
    /**
     * 获取
     */
    get h() {
        return this.#h;
    }

    /**
     * 获取
     */
    get renderer() {
        return this.#renderer;
    }

    /**
     * 获取
     */
    get renderer_pipeline() {
        return this.#renderer_pipeline;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} render_canvas 
     */
    constructor(render_canvas) {
        super();
        this.#html_canvas = render_canvas;
        this.#interactive_proxy = new InteractiveIsolate(render_canvas);
        this.#renderer = new Renderer({
            powerPreference         : 'high-performance',
            antialias               : true,
            alpha                   : true,
            precision               : 'highp',
            canvas                  : render_canvas,
            premultipliedAlpha      : true,
            preserveDrawingBuffer   : true,
            forceWebGL              : __IF_WEBGPU_FORCE_WEBGL20__,
            logarithmicDepthBuffer  : false// 设置对数深度缓冲区
        });
    }

    /**
     * 初始化
     */
    async init() {
        //
        // 考虑可能是WebGPU
        //
        // 统一成异步初始化
        //
        if (isFunction(this.#renderer.init)) {
            await this.#renderer.init();
        }
        
        // 初始化
        const request_animation_frame = () => this.requestAnimationFrame();
        this.#keyboard_watcher.setEnable(true);
        this.#scene                     = new Scene(request_animation_frame, this.#renderer);
        this.#camera_creator            = new CameraCreator(this.#scene, this);
        this.#light_supervisor          = new LightSupervisor(this.#scene, this);
        this.#light_associate_container = this.#light_supervisor.getAssociateContainer();
        this.#personal_cameraman        = new PersonalCameraman(this);
        this.#layers_adapter            = new LayersAdapter(() => this.requestAnimationFrame());

        // 相机控制器
        this.#orbit = new Orbit(this, this.#interactive_proxy, this.#personal_cameraman, false);
        this.#orbit.setDistance(Constants.ORBIT_DISTANCE_DEFAULT);
        this.#orbit.reset();

        // 渲染管线
        this.#renderer_pipeline = new RendererPipeline(
            this, 
            this.#renderer, 
            this.#interactive_proxy, 
            this.#scene, 
            this.#personal_cameraman, 
            this.#orbit);

        // 交互
        this.#interactive_controller = new IsolateInteractiveController(
            this.#interactive_proxy, 
            this, 
            this.#renderer_pipeline);

        // 配置
        this.#conf_context = new IsolateConfContext(this, this.#renderer, this.#renderer_pipeline);

        // 标记初始化成功
        this.#inited = true;
    }

    /**
     * 
     * 大小发生变动的时候
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    onResize(pixel_ratio, width, height) {
        this.#pixel_ratio = pixel_ratio;
        this.#w = width;
        this.#h = height;
        this.dispatchEvent('resize', { width, height });

        if (this.#inited) {
            this.#renderer.setPixelRatio(pixel_ratio);
            this.#renderer.setSize(width, height);
            this.#personal_cameraman.resize(width, height);
            this.#renderer_pipeline.resize(pixel_ratio, width, height);
            if (!this.#renderer_first_resize) {
                this.immediateRender();
            } else {
                this.#renderer_first_resize = false;
                this.requestAnimationFrame();
            }
        }
    }

    /**
     * 
     * 设置覆盖的场景
     * 
     * @param {*} scene 
     */
    setOverrideScene(scene) {
        this.#renderer_pipeline.setOverrideScene(scene);
    }

    /**
     * 
     * 设置外部组件
     * 
     * @param {*} controller 
     */
    setOutletController(controller) {
        this.#renderer_pipeline.setOutletController(controller);
    }

    /**
     * 
     * 获取交互元素隔离
     * 
     * @returns 
     */
    getInteractive() {
        return this.#interactive_proxy;
    }

    /**
     * 
     * 获取键盘监控
     * 
     * @returns 
     */
    getKeyboardWatcher() {
        return this.#keyboard_watcher;
    }

    /**
     * 
     * 获取场景
     * 
     * @returns 
     */
    getScene() {
        return this.#scene;
    }

    /**
     * 
     * 获取场景层管理适配器
     * 
     * @returns 
     */
    getSceneLayersAdapter() {
        return this.#layers_adapter;
    }

    /**
     * 
     * 获取渲染器的宽度，逻辑像素
     * 
     * @returns 
     */
    getW() {
        return this.#w;
    }

    /**
     * 
     * 获取渲染器的高度，逻辑像素
     * 
     * @returns 
     */
    getH() {
        return this.#h;
    }

    /**
     * 
     * 获取逻辑像素比
     * 
     * @returns 
     */
    getPixelRatio() {
        return this.#pixel_ratio;
    }

    /**
     * 
     * UI 坐标系转化到 NDC坐标系
     * 
     * @param {Number} value 
     */
    toNDC_X(value) {
        return (2.0 * value / this.#w) - 1;
    }

    /**
     * 
     * UI 坐标系转化到 NDC坐标系
     * 
     * @param {Number} value 
     */
    toNDC_Y(value) {
        return 1 - (2.0 * value / this.#h);
    }

    /**
     * 
     * NDC 坐标系转 UI 坐标系
     * 
     * @param {*} value 
     */
    toUI_X(value) {
        return (0.5 * (value + 1)) * this.#w;
    }

    /**
     * 
     * NDC 坐标系转 UI 坐标系
     * 
     * @param {*} value 
     */
    toUI_Y(value) {
        return (0.5 * (1 - value)) * this.#h;
    }

    /**
     * 
     * NDC 转化到屏幕
     * 
     * @param {*} value 
     */
    toScreen_X(value) {
        return this.toUI_X(value) + this.#html_canvas.getBoundingClientRect().left;
    }
    
    /**
     * 
     * NDC 转化到屏幕
     * 
     * @param {*} value 
     */
    toScreen_Y(value) {
        return this.toUI_Y(value) + this.#html_canvas.getBoundingClientRect().top;
    }
    
    /**
     * 
     * 获取配置
     * 
     * @returns 
     */
    getConfContext() {
        return this.#conf_context;
    }

    /**
     * 
     * 获取交互管理器
     * 
     * @returns 
     */
    getInteractiveController() {
        return this.#interactive_controller;
    }

    /**
     * 
     * 获取orbit
     * 
     * @returns 
     */
    getOrbit() {
        return this.#orbit;
    }

    /**
     * 
     * 获取加载器
     * 
     * @returns 
     */
    getLoader() {
        return Loader;
    }

    /**
     * 
     * 获得渲染器
     * 
     * @returns 
     */
    getRenderer() {
        return this.#renderer;
    }

    /**
     * 
     * 获取渲染管线
     * 
     * @returns 
     */
    getRendererPipeline() {
        return this.#renderer_pipeline;
    }

    /**
     * 
     * 获取预览
     * 
     * @returns 
     */
    getCameraPreview() {
        return this.#renderer_pipeline.camera_preview;
    }

    /**
     * 
     * 获取当前使用的相机
     * 
     * @returns 
     */
    getCamera() {
        return this.#personal_cameraman.camera;
    }
    
    /**
     * 
     * 获取自由相机
     * 
     * @returns 
     */
    getPersonalCameraman() {
        return this.#personal_cameraman;
    }

    /**
     * 
     * 获取相加构建工具
     * 
     * @returns 
     */
    getCameraCreator() {
        return this.#camera_creator;
    }

    /**
     * 
     * 获取灯光构建工具
     * 
     * @returns 
     */
    getLightSupervisor() {
        return this.#light_supervisor;
    }

    /**
     * 
     * 获取灯光想过的容器
     * 
     * @returns 
     */
    getLightAssociateContainer() {
        return this.#light_associate_container;
    }

    /**
     * 
     * 获取
     * 
     * @returns 
     */
    getTransformer() {
        return this.#renderer_pipeline.transformer;
    }

    /**
     * 
     * 设置只允许拖拉
     * 
     * @param {*} only 
     * @returns 
     */
    setTransformerOnlyTranslate(only = false) {
        return this.#renderer_pipeline.transformer.setOnlyTranslate(only);
    }

    /**
     * 
     * 获取拾取
     * 
     * @param {*} ndc_x 
     * @param {*} ndc_y 
     * @returns 
     */
    getRaycaster(ndc_x, ndc_y) {
        VEC2_0.x = ndc_x;
        VEC2_0.y = ndc_y;
        RAYCASTER_0.setFromCamera(VEC2_0, this.getCamera());
        return RAYCASTER_0;
    }

    /**
     * 
     * 执行渲染
     * 
     * @param {*} timestamp 
     * @returns 
     */
    immediateRender(timestamp) {
        if (this.#is_rendering) {
            return;
        }

        if (this.#renderer_request_animation_frame_id) {
            cancelAnimationFrame(this.#renderer_request_animation_frame_id);
            this.#renderer_request_animation_frame_id = undefined;
        }

        if (this.#is_waitting_render) {
            this.#is_waitting_render = false;    
        }

        if (this.#w === 0 || this.#h === 0) {
            return;
        }

        this.dispatchEvent('frame-begin', {timestamp});
        this.#scene.dispatchEvent('before-render', {timestamp});
        this.#is_rendering = true;
        this.#light_supervisor.update();
        this.#renderer.info.autoReset = false;
        this.#renderer_pipeline.setSceneRenderLayerMask(this.#layers_adapter.mask);
        this.#renderer_pipeline.render();
        this.#renderer.info.reset();
        this.#is_rendering = false;
        this.#scene.dispatchEvent('after-render');
        this.dispatchEvent('frame-end');
    }

    /**
     * 请求一帧新的渲染
     */
    requestAnimationFrame() {
        if (this.#is_waitting_render ||this.#w <= 0 || this.#h <= 0) {
            return;
        }
        this.#is_waitting_render = true;
        this.#renderer_request_animation_frame_id = requestAnimationFrame(
            timestamp => {
                this.#renderer_request_animation_frame_id = undefined;
                this.immediateRender(timestamp);
            }
        );
    }

    /**
     * 
     * 把渲染的结果保存成PNG
     * 
     * @param {*} file_name 
     */
    saveToPng(file_name) {
        const link    = document.createElement('a');
        link.href     = this.#html_canvas.toDataURL("image/png");
        link.download = file_name ? file_name : "canvas.png";
        link.click();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#keyboard_watcher.dispose();
    }
}
