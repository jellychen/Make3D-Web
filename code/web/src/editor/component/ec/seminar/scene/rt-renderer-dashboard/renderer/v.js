/* eslint-disable no-unused-vars */

import isString                 from 'lodash/isString';
import SaveCanvasAsPng          from '@common/misc/save-canvas-as-png';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import TracerRenderer           from '@core/rt-renderer/tracer-renderer';
import TracerRendererController from '@core/rt-renderer/tracer-renderer-controller';
import DefaultConf              from '../default-conf';
import DefaultConfCenter        from '../default-conf-center';
import ProgressBar              from './v-progress-bar';
import ProgressValue            from './v-progress-value';
import Loading                  from './v-loading';
import RendererDenoising        from './v-denoising';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-renderer';

/**
 * 用来承载渲染器
 */
export default class RendererView extends Element {
    /**
     * 协调器
     */
    #coordinator;
    #renderer;

    /**
     * 元素
     */
    #container;
    #container_resize_observer;
    #canvas;
    #progress_bar;

    /**
     * 动态元素
     */
    #loading        = new Loading();
    #denoising      = new RendererDenoising();
    #progress_value = new ProgressValue();

    /**
     * 编辑渲染器
     */
    #cinderella;

    /**
     * 场景
     */
    #scene;
    #scene_camera;

    /**
     * 事件回调
     */
    #on_view_changed = event => this.#onCinderellaViewChanged(event);

    /**
     * 光追渲染器
     */
    #tracer_renderer_pipeline_build_success = false;
    #tracer_renderer;
    #tracer_renderer_controller;

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 获取
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * 获取
     */
    get tracer() {
        return this.#tracer_renderer.tracer;
    }

    /**
     * 获取
     */
    get tracer_renderer() {
        return this.#tracer_renderer;
    }
    
    /**
     * 获取
     */
    get current_sample_count() {
        if (this.#tracer_renderer) {
            return this.#tracer_renderer.currentSampleCount;
        }
        return 0;
    }

    /**
     * 获取 目标采用数量
     */
    get sample_count() {
        if (this.#tracer_renderer) {
            return this.#tracer_renderer.targetSampleCount;
        }
        return 0;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator  = coordinator;
        this.#renderer     = this.#coordinator.cinderella.getRenderer();
        this.#cinderella   = coordinator.cinderella;
        this.#scene        = coordinator.scene;
        this.#scene_camera = coordinator.camera;
        this.#tracer_renderer = new TracerRenderer(this.#renderer);
        this.#tracer_renderer.on_load_webgpu                   = success => this.#onLoadWebgpu(success);
        this.#tracer_renderer.on_load_tracer_success           = () => this.#onLoadTracerSuccess();
        this.#tracer_renderer.on_load_tracer_pipeline_success  = () => this.#onLoadTracerPipelineSuccess();
        this.#tracer_renderer.on_load_tracer_pipeline_begin    = () => this.#onLoadTracerPipelineBegin();
        this.#tracer_renderer.on_load_tracer_pipeline_progress = val => this.#onLoadTracerPipelineProgress(val);
        this.#tracer_renderer.on_load_tracer_pipeline_end      = () => this.#onLoadTracerPipelineEnd();
        this.#tracer_renderer_controller = this.#tracer_renderer.tracer_renderer_controller;
        this.#tracer_renderer_controller.on_render_begin  = () => this.#onRenderStart();
        this.#tracer_renderer_controller.on_render_frame  = () => this.#onRenderFrame();
        this.#tracer_renderer_controller.on_render_end    = () => this.#onRenderEnd();
        this.#tracer_renderer_controller.on_denoise_begin = () => this.#onDenoiseBegin();
        this.#tracer_renderer_controller.on_denoise_end   = () => this.#onDenoiseEnd();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container    = this.getChild('#container');
        this.#canvas       = this.getChild('#canvas');
        this.#progress_bar = this.getChild('#progress-bar');
        this.#cinderella.addEventListener('view-changed', this.#on_view_changed);

        // 场景加载
        if (!TracerRenderer.isSupportWebGPU()) {
            throw new Error("not support webgpu");
        } else {
            try {
                this.#loadScene().then(() => {
                });
            } catch (e) {
                console.error(e);
            }
            this.#container.appendChild(this.#loading);
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#container_resize_observer = new ResizeObserver(entries => {
            this.#onCanvasSizeChanged();
        });
        this.#container_resize_observer.observe(this.#container);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#container_resize_observer) {
            this.#container_resize_observer.disconnect();
            this.#container_resize_observer = undefined;
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} tips 
     */
    showTips(tips) {
        this.dispatchUserDefineEvent('tips', {
            tips
        });
    }

    /**
     * 加载场景
     */
    async #loadScene() {
        const ibl = await DefaultConfCenter.loadEnvMap();
        await this.#tracer_renderer.loadOneStep({
            canvas : this.#canvas,
            mode   : 'Dynamic',
            scene  : this.#scene,
            camera : this.#scene_camera,
            ibl    : ibl,
            conf   : DefaultConfCenter,
        });
        this.#tracer_renderer_pipeline_build_success = true;

        // 初始化尺寸
        const w = this.#container.clientWidth;
        const h = this.#container.clientHeight;
        this.#tracer_renderer.setResolutionSize(window.devicePixelRatio || 1.0, w, h);
        this.#tracer_renderer.updateCamera(this.#coordinator.camera);
        this.#tracer_renderer.setNeedsUpdate();

        // 启动
        this.#tracer_renderer_controller.start();
    }

    /**
     * 
     * 加载WebGPU
     * 
     * @param {*} success 
     */
    #onLoadWebgpu(success) {
        if (success) {
            this.showTips('load webgpu success');
        } else {
            this.showTips('load webgpu fail');
        }
    }

    /**
     * 加载成功
     */
    #onLoadTracerSuccess() {
        this.dispatchUserDefineEvent('load-tracer-success', {});
        if (this.#loading) {
            this.#loading.remove();
        }
        this.showTips('load tracer kernel success');
    }

    /**
     * 加载渲染管线
     */
    #onLoadTracerPipelineSuccess() {
        this.showTips('load tracer pipeline success');
        this.dispatchUserDefineEvent('load-pipeline-success', {});
    }

    /**
     * 加载管线数据
     */
    #onLoadTracerPipelineBegin() {
        this.showTips('load tracer pipeline begin');
        this.#container.appendChild(this.#progress_value);
        this.#progress_value.setPercent(0);
        this.dispatchUserDefineEvent('load-pipeline-begin', {});
    }

    /**
     * 
     * 加载管线数据进度
     * 
     * @param {*} progress 
     */
    #onLoadTracerPipelineProgress(progress) {
        this.#progress_value.setPercent(progress);
    }

    /**
     * 加载管线数据结束
     */
    #onLoadTracerPipelineEnd() {
        this.showTips('load tracer pipeline end');
        this.#progress_value.remove();
        this.dispatchUserDefineEvent('load-pipeline-end', {});
    }

    /**
     * 渲染开始
     */
    #onRenderStart() {
        this.dispatchUserDefineEvent('render-start', {});
    }
    
    /**
     * 渲染成一帧
     */
    #onRenderFrame() {
        const current = this.#tracer_renderer.currentSampleCount;
        const target  = this.#tracer_renderer.targetSampleCount;
        if (current >= target && this.#tracer_renderer_controller) {
            this.#tracer_renderer_controller.stop(true);
        }
        this.#progress_bar.setPercent(current / target);
        this.dispatchUserDefineEvent('render-frame', {});
    }

    /**
     * 渲染结束
     */
    #onRenderEnd() {
        this.dispatchUserDefineEvent('render-end', {});
    }

    /**
     * 开启降噪
     */
    #onDenoiseBegin() {
        this.#denoising.show(this.#container);
    }

    /**
     * 降噪结束
     */
    #onDenoiseEnd() {
        this.#denoising.dismiss();
    }

    /**
     * 尺寸发生变化
     */
    #onCanvasSizeChanged() {
        const dpr = window.devicePixelRatio || 1.0;
        const w   = this.#container.clientWidth;
        const h   = this.#container.clientHeight;
        this.#canvas.width  = Math.round(w * dpr);
        this.#canvas.height = Math.round(h * dpr);
        this.#canvas.style.width  = w + 'px';
        this.#canvas.style.height = h + 'px';

        // 只有在光追创建Pipeline完成后才可以调整尺寸
        if (this.#tracer_renderer_pipeline_build_success) {
            this.#tracer_renderer.setResolutionSize(dpr, w, h);
            this.#tracer_renderer.setNeedsUpdate();
            if (this.#tracer_renderer_controller.isIdle) {
                this.#tracer_renderer_controller.start();
            }
        }
    }

    /**
     * 相机发生了变化
     */
    #onCinderellaViewChanged() {
        if (this.#tracer_renderer_pipeline_build_success) {
            this.#tracer_renderer.updateCamera(this.#coordinator.camera);
            this.#tracer_renderer.setNeedsUpdate();
            if (this.#tracer_renderer_controller.isIdle) {
                this.#tracer_renderer_controller.start();
            }
        }
    }

    /**
     * 
     * 保存成图片
     * 
     * @param {*} name 
     */
    async saveAsPng(name = undefined) {
        await this.#tracer_renderer.blitToScreen();
        await this.#tracer_renderer.blitToScreen();
        SaveCanvasAsPng(this.#canvas, name || "make3d-renderer.png");
    }

    /**
     * 停止渲染
     */
    stop() {
        if (this.#tracer_renderer_pipeline_build_success) {
            this.#tracer_renderer_controller.stop();
        }
    }

    /**
     * 恢复
     */
    resume() {
        if (this.#tracer_renderer_pipeline_build_success) {
            const current = this.#tracer_renderer.currentSampleCount;
            const target  = this.#tracer_renderer.targetSampleCount;
            if (target <= current) {
                this.#tracer_renderer.setNeedsUpdate();
            }
            this.#tracer_renderer_controller.start();
        }
    }

    /**
     * 
     * 设置目标
     * 
     * @param {*} count 
     */
    setTargetSampleCount(count) {
        if (this.#tracer_renderer_pipeline_build_success) {
            this.#tracer_renderer.setTargetSampleCount(count);
            this.#tracer_renderer.setNeedsUpdate();
        }
    }

    /**
     * 刷新，从头开始渲染
     */
    refresh() {
        if (this.#tracer_renderer_pipeline_build_success) {
            this.#tracer_renderer.setNeedsUpdate();
            if (this.#tracer_renderer_controller.isIdle) {
                this.#tracer_renderer_controller.start();
            }
        }
    }

    /**
     * 
     * 设置渲染的质量，会重头渲染
     * 
     * preview 
     * hd
     * super
     * ultra
     * 
     * @param {*} quality 
     */
    setQuality(quality) {
        if (this.#tracer_renderer_pipeline_build_success) {
            switch (quality) {
            case 'preview':
                this.setTargetSampleCount(100);
                this.#tracer_renderer.setDenoiseLastFrame(false);
                break;

            case 'hd':
                this.setTargetSampleCount(400);
                this.#tracer_renderer.setDenoiseLastFrame(true);
                break;

            case 'super':
                this.setTargetSampleCount(800);
                this.#tracer_renderer.setDenoiseLastFrame(true);
                break;

            case 'ultra':
                this.setTargetSampleCount(1500);
                this.#tracer_renderer.setDenoiseLastFrame(true);
                break;

            case 'ultimate':
                this.setTargetSampleCount(3000);
                this.#tracer_renderer.setDenoiseLastFrame(true);
                break;
            }

            this.#tracer_renderer.setNeedsUpdate();
            if (this.#tracer_renderer_controller.isIdle) {
                this.#tracer_renderer_controller.start();
            }
        }
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#cinderella) {
            this.#cinderella.removeEventListener('view-changed', this.#on_view_changed);
        }

        if (this.#tracer_renderer_controller) {
            this.#tracer_renderer_controller.stop();
            this.#tracer_renderer_controller = undefined;
        }

        if (this.#tracer_renderer) {
            this.#tracer_renderer.dispose();
            this.#tracer_renderer = undefined;
        }
    }
}

CustomElementRegister(tagName, RendererView);
