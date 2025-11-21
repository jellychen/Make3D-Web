/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';
import Mesh           from './mesh';
import Constants      from './constants';

/**
 * 渲染场景
 */
export default class Renderable extends XThree.Group {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 核心渲染器
     */
    #cinderella;

    /**
     * 核心渲染器
     */
    #cinderella_renderer_pipeline;

    /**
     * 监听渲染开始的事件
     */
    #on_begin_render = event => this.#onFrameBeginRender(event);

    /**
     * UI
     */
    #receptacle;

    /**
     * 用来协调进行Boolean计算
     */
    #boolean_coordinator;

    /**
     * wasm 对象
     */
    #connector;
    #connector_renderable;

    /**
     * 用于渲染的网格
     */
    #mesh;

    /**
     * 需要更新
     */
    #need_update = true;

    /**
     * 后续设置使用
     */
    #geometry                 = new XThree.BufferGeometry();
    #buffer_attribute_v       = new XThree.BufferAttribute(new Float32Array(), 3);
    #buffer_attribute_v_count = 0;
    #buffer_attribute_i       = new XThree.BufferAttribute(new Uint32Array (), 1);
    #buffer_attribute_i_count = 0;

    /**
     * 材质
     */
    #material = new XThreeMaterial.AspectColorNotSmooth();

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} connector 
     * @param {*} receptacle 
     * @param {*} boolean_coordinator 
     */
    constructor(coordinator, connector, receptacle, boolean_coordinator) {
        super();
        this.#coordinator                  = coordinator;
        this.#connector                    = connector;
        this.#connector_renderable         = connector.renderable();
        this.#receptacle                   = receptacle;
        this.#cinderella                   = this.#coordinator.cinderella;              // 核心渲染器
        this.#cinderella_renderer_pipeline = this.#cinderella.getRendererPipeline();    // 渲染流程
        this.#boolean_coordinator          = boolean_coordinator;
        
        // 渲染元素
        this.#mesh                         = new Mesh();
        this.#material.setFrontColor(Constants.COLOR_FACE_COLOR);
        this.#material.setBackColor (Constants.COLOR_FACE_COLOR);
        this.#material.side                = XThree.DoubleSide;
        this.#material.polygonOffset       = true;
        this.#material.polygonOffsetFactor = -1;
        this.#material.polygonOffsetUnits  = -1;
        this.#mesh.material                = this.#material;
        this.#geometry.boundingBox         = new XThree.Box3();
        this.#geometry.boundingSphere      = new XThree.Sphere();
        this.#geometry.setAttribute('position', this.#buffer_attribute_v);
        this.#geometry.setIndex(this.#buffer_attribute_i);
        this.#geometry.setDrawRange(0, 0);
        this.#mesh.geometry                = this.#geometry;
        this.add(this.#mesh);

        // 标记成辅助元素
        this.setMarkAuxiliary(true);

        // 监听事件
        this.#cinderella_renderer_pipeline.addEventListener('begin-render', this.#on_begin_render);
    }

    /**
     * 标记需要更新
     */
    markNeedUpdate() {
        this.#need_update = true;
    }

    /**
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @returns 
     */
    #onFrameBeginRender(renderer_pipeline) {
        if (!this.#need_update) {
            return;
        } else {
            if (!this.#boolean_coordinator.update()) {
                this.visible = false;
            } else {
                this.#update();
                this.visible = true;
            }
            this.#need_update = false;
        }
        this.#receptacle.update();
    }

    /**
     * 更新
     */
    #update() {
        // 更新数据
        this.#connector_renderable.update();
        const v = this.#connector_renderable.v();
        const i = this.#connector_renderable.i();
        if (!v || !i) {
            this.#geometry.setDrawRange(0, 0);
            return;
        }

        // 更新 顶点
        if (this.#buffer_attribute_v_count < v.length) {
            this.#buffer_attribute_v_count = Math.NextPowerOfTwo(v.length);
            this.#buffer_attribute_v = new XThree.BufferAttribute(new Float32Array(this.#buffer_attribute_v_count), 3);
            this.#buffer_attribute_v.setUsage(XThree.StreamDrawUsage);
            this.#geometry.setAttribute('position', this.#buffer_attribute_v);
        }
        this.#buffer_attribute_v.set(v, 0);
        this.#buffer_attribute_v.addUpdateRange(0, v.length);
        this.#buffer_attribute_v.needsUpdate = true;
        
        // 更新 索引
        if (this.#buffer_attribute_i_count < i.length) {
            this.#buffer_attribute_i_count = Math.NextPowerOfTwo(i.length);
            this.#buffer_attribute_i = new XThree.BufferAttribute(new Uint32Array(this.#buffer_attribute_i_count), 1);
            this.#buffer_attribute_i.setUsage(XThree.StreamDrawUsage);
            this.#geometry.setIndex(this.#buffer_attribute_i);
        }
        this.#buffer_attribute_i.set(i, 0);
        this.#buffer_attribute_i.addUpdateRange(0, i.length);
        this.#buffer_attribute_i.needsUpdate = true;
        this.#geometry.setDrawRange(0, i.length);
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#mesh) {
            this.#mesh.dispose(true, true);
            this.#mesh = undefined;
        }
        this.#cinderella_renderer_pipeline.removeEventListener('begin-render', this.#on_begin_render);
    }
}
