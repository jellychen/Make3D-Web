/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowToastWarn         from '@ux/controller/toast-warn';
import SaveCanvasAsPng       from '@common/misc/save-canvas-as-png';
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-uv-presenter';

/**
 * 默认
 */
const DEFAULT_SIZE_W = 360;
const DEFAULT_SIZE_H = 360;

/**
 * 展示UV
 */
export default class Presenter extends Element {
    /**
     * 元素
     */
    #container;
    #canvas_container;
    #canvas;
    
    /**
     * c++ 对象
     */
    #connector;
    #connector_renderable;

    /**
     * 监控尺寸变换和截流
     */
    #resize_observer;

    /**
     * 渲染器
     */
    #renderer;
    #renderer_uv_version = 0;

    /**
     * 是否允许
     */
    #ignore_faces_count = false;

    /**
     * tips
     */
    #tips;
    #tips_btn_cancel;
    #tips_btn_continue;
    
    /**
     * 获取渲染器
     */
    get renderer() {
        return this.#renderer;
    }

    /**
     * 获取
     */
    get content() {
        return this.#container;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} connector 
     */
    constructor(connector) {
        super(tagName);
        this.#connector = connector;
        this.#connector_renderable = this.#connector.renderable();
        this.createContentFromTpl(tpl);
        this.#renderer = new Renderer(this.#canvas);
        this.update();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container          = this.getChild('#container');
        this.#canvas_container   = this.getChild('#area');
        this.#canvas             = this.getChild('#canvas');
        this.#tips               = this.getChild('#tips');
        this.#tips_btn_cancel    = this.getChild('#tips-cancel');
        this.#tips_btn_continue  = this.getChild('#tips-continue');
        this.#tips_btn_cancel.onclick   = event => this.#onClickTipsBtnCancel(event);
        this.#tips_btn_continue.onclick = event => this.#onClickTipsBtnContinue(event);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#resize_observer = new ResizeObserver(entries => this.onResize());
        this.#resize_observer.observe(this);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#resize_observer) {
            this.#resize_observer.unobserve(this);
            this.#resize_observer.disconnect();
            this.#resize_observer = undefined;
        }
    }

    /**
     * 展开UV
     */
    unfold() {
        // 如果面超过 4w 
        const faces_count = this.#connector.faces_count();
        if (faces_count >= 40000) {
            ShowToastWarn({
                token : "uv.stitched.too.may.faces",
            });
            return;
        }

        // 如果面超过 2w 
        if (!this.#ignore_faces_count && faces_count >= 20000) {
            this.#tips.style.visibility = "visible";
            return;
        }

        // 执行展开
        this.#connector.unfold_stitched_edges();
        this.update();
        this.renderNextFrame();
    }

    /**
     * 
     * 把Canvas的内容保存成Png
     * 
     * @param {*} name 
     */
    saveAsPng(name = undefined) {
        SaveCanvasAsPng(this.#canvas, name || "uv.mask.png");
    }

    /**
     * 更新渲染的数据
     */
    update() {
        const renderable = this.#connector_renderable;
        renderable.prepare();
        const version = renderable.version_uv();
        if (this.#renderer_uv_version == version) {
            return;
        } else {
            this.#renderer_uv_version = version;
        }

        this.#renderer.setPoints(renderable.uv_vertex(), true);
        this.#renderer.setLineSegments(renderable.uv_wireframe());
    }

    /**
     * 下一帧执行渲染
     */
    renderNextFrame() {
        if (this.#renderer) {
            this.#renderer.renderNextFrame();
        }
    }

    /**
     * 尺寸发生了变化
     */
    onResize() {
        //
        // this.adjustBoardScaleToEnsureCanbeSeen();
        //
        const w = this.#canvas_container.offsetWidth;
        const h = this.#canvas_container.offsetHeight;
        this.#renderer.setSize(w, h, window.devicePixelRatio);
    }

    // /**
    //  * 调整board确保可以被看到
    //  */
    // adjustBoardScaleToEnsureCanbeSeen() {
    //     const w  = this.clientWidth;
    //     const h  = this.clientHeight;
    //     const w0 = w - 32;
    //     const h0 = h - 32;
    //     const p0 = Math.min(w0 / DEFAULT_SIZE_W, 1.0);
    //     const p1 = Math.min(h0 / DEFAULT_SIZE_H, 1.0);
    //     const ss = Math.min(p0, p1);
    //     this.#container.style.transform = `scale(${ss},${ss})`;
    // }

    /**
     * 
     * 点击取消按钮
     * 
     * @param {*} event 
     */
    #onClickTipsBtnCancel(event) {
        this.#tips.style.visibility = "hidden";
    }

    /**
     * 
     * 点击继续的按钮
     * 
     * @param {*} event 
     */
    #onClickTipsBtnContinue(event) {
        this.#connector.unfold_stitched_edges();
        this.update();
        this.renderNextFrame();
        this.#tips.style.visibility = "hidden";
        this.#ignore_faces_count = true;
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#renderer) {
            this.#renderer.dispose();
            this.#renderer = undefined;
        }
    }
}

CustomElementRegister(tagName, Presenter);
