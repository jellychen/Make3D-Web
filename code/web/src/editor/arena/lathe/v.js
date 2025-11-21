/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import EditableMesh          from '@core/cinderella/mesh/editable';
import MeshFromSoup          from '@core/misc/mesh-from-soup';
import CurveEditor           from './curve-editor/v';
import Cell                  from './cell';
import Renderer3D            from './renderer';
import Controller            from './controller';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-lathe';

/**
 * 车床窗口
 */
export default class Editor extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 历史记录
     */
    #historical_recorder;

    /**
     * 元素
     */
    #container;
    #btn_close;
    #canvas;
    #curve_editor;
    #segments;
    #steps;
    #add_to_scene;

    /**
     * 监控尺寸
     */
    #canvas_resize_observer;

    /**
     * 三维渲染
     */
    #canvas_renderer_3d;

    /**
     * 协调器
     */
    #controller;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#historical_recorder = coordinator.getHistoricalRecorder();
        this.#historical_recorder.disbale_rollback = true;
        this.observerBubblesEvent();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container              = this.getChild('#container');
        this.#btn_close              = this.getChild('#close-btn');
        this.#curve_editor           = this.getChild('#curve-editor');
        this.#canvas                 = this.getChild('#canvas');
        this.#segments               = this.getChild('#segments');
        this.#steps                  = this.getChild('#steps');
        this.#add_to_scene           = this.getChild('#addtoscene');
        this.#canvas_renderer_3d     = new Renderer3D(this.#canvas);
        this.#btn_close.onclick      = () => this.dispose();
        this.#add_to_scene.onclick   = () => this.#addPolygonToScreen();
        this.#controller             = new Controller(this.#curve_editor, this.#canvas_renderer_3d);
        this.#curve_editor.onchanged = () => this.#update();
        this.#controller.update();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        this.#canvas_resize_observer = new ResizeObserver(entries => {
            this.#onResize()
        });
        this.#canvas_resize_observer.observe(this.#canvas);

        Animation.Try(this.#container, {
            duration   : 300,
            easing     : 'out',
            translateY : [-50, 0],
            opacity    : [0, 1],
            onComplete : () => {
                ;
            }
        });
    }

    /**
     * 从DOM上摘除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (undefined != this.#canvas_resize_observer) {
            this.#canvas_resize_observer.unobserve(this.#canvas);
            this.#canvas_resize_observer.disconnect();
            this.#canvas_resize_observer = undefined;
        }
    }

    /**
     * 当尺寸发生变化的时候
     */
    #onResize() {
        const ratio = window.devicePixelRatio || 1;
        const w = this.#canvas.offsetWidth;
        const h = this.#canvas.offsetHeight;
        this.#canvas.width  = ratio * w;
        this.#canvas.height = ratio * h;
        this.#canvas_renderer_3d.resize(ratio, w, h);
    }

    /**
     * 添加到场景
     */
    #addPolygonToScreen() {
        const soup = this.#controller.soup;
        if (!soup) {
            return;
        }

        const mesh = new EditableMesh();

        MeshFromSoup(mesh, soup);

        this.#coordinator.scene.add(mesh);
        this.#coordinator.selected_container.replace(mesh);
        this.#coordinator.updateTransformer();
        this.#coordinator.markTreeViewNeedUpdate(true);
        this.#coordinator.renderNextFrame();

        this.dispose();
    }

    /**
     * 更新
     */
    #update() {
        this.#controller.setSegmentCount(this.#segments.getValue());
        this.#controller.setSteps(this.#steps.getValue());
        this.#controller.update();
        this.#canvas_renderer_3d.renderNextFrame();
    }

    /**
     * 
     * 接收到孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        super.onRecvBubblesEvent(event);
        this.#update();
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#historical_recorder) {
            this.#historical_recorder.disbale_rollback = false;
            this.#historical_recorder = undefined;
        }
        
        if (this.#canvas_renderer_3d) {
            this.#canvas_renderer_3d.canelIfNeedRenderNextFrame();
            this.#canvas_renderer_3d = undefined;
        }

        Animation.Try(this.#container, {
            duration   : 300,
            easing     : 'out',
            translateY : [0, -50],
            opacity    : [1, 0],
            onComplete : () => {
                if (this.#canvas_renderer_3d) {
                    this.#canvas_renderer_3d.dispose();
                    this.#canvas_renderer_3d = undefined;
                }
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, Editor);
