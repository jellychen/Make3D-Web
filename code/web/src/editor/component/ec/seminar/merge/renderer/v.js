/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import AspectColor           from '@xthree/material/aspect-color';
import Line                  from '@xthree/renderable/line/line-segments-immediate';
import CustomElementRegister from '@ux/base/custom-element-register';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Element               from '@ux/base/element';
import GlobalScope           from '@common/global-scope';
import Renderer              from './renderer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-merge-renderer-view';

/**
 * 展示组建
 */
export default class RendererView extends Element {
    /**
     * 元素
     */
    #canvas;

    /**
     * 监控尺寸
     */
    #canvas_resize_observer;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#canvas = this.getChild('#canvas');
        this.#canvas.onwheel = event => this.#onWheel(event);
        this.#renderer = new Renderer(this.#canvas);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} soup 
     */
    setSoup(soup) {
        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupTriangulator,
            GeoSolidSoupWireframe,
        } = Chameleon;

        const group = new XThree.Group();

        {
            const material               = new AspectColor();
            material.polygonOffset       = true;
            material.polygonOffsetFactor = 2;
            material.polygonOffsetUnits  = 2;
            material.setEnhance(1);
            material.setFrontColor(0xA8A8A8);
            material.setBackColor (0x680000);
            const mesh = new XThree.Mesh(new XThree.BufferGeometry());
            mesh.material = material;
            const indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());
            mesh.geometry.setAttr('position', soup.vertices(), 3, true);
            mesh.geometry.setIndices32(indices, true);
            mesh.computeVertexNormalsAndReserveAcuteAngle();
            mesh.geoChanged();

            group.add(mesh);
        }

        {
            const mesh_wireframe = new Line();
            mesh_wireframe.setColor(0x0);
            const wireframe = GeoSolidSoupWireframe.MakeShared();
            wireframe.build(soup.getPtr());
            mesh_wireframe.setSegments(wireframe.edges());
            wireframe.delete();
            
            group.add(mesh_wireframe);
        }

        this.#renderer.setRenderObject(group);
        this.#renderer.renderNextFrame();
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
        this.#renderer.resize(ratio, w, h);
    }

    /**
     * 
     * 滚轮
     * 
     * @param {*} event 
     */
    #onWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.#renderer.orbit.zoomUp();
        } else {
            this.#renderer.orbit.zoomDown();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#renderer.dispose();
    }
}

CustomElementRegister(tagName, RendererView);
