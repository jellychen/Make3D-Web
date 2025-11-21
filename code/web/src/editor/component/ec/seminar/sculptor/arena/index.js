/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';
import P          from '../renderable/points';
import L          from '../renderable/line-segments';
import SG         from '../renderable/surface-geometry';
import S          from '../renderable/surface';

/**
 * 渲染场景
 */
export default class Arena extends XThree.Group {
    /**
     * 核心的协调器
     */
    #coordinator;

    /**
     * 控制器
     */
    #connector;
    #connector_renderable;

    /**
     * 标记是不是需要更新
     */
    #need_update = true;

    /**
     * 数据同步的版本
     */
    #version_vertices         = 0;
    #version_vertices_indices = 0;
    #version_vertices_normal  = 0;
    #version_edges_inices     = 0;

    /**
     * 同享数据
     */
    #a_points_count        = 0;
    #a_points              = new XThree.BufferAttribute(new Float32Array(), 3);
    #a_points_normal_count = 0;
    #a_points_normal       = new XThree.BufferAttribute(new Float32Array(), 3);

    /**
     * 可渲染
     */
    #v  = new P (this.#a_points);
    #l  = new L (this.#a_points);
    #sg = new SG(this.#a_points, this.#a_points_normal);
    #s0 = new S (this.#sg, false, 1);
    #s1 = new S (this.#sg, true , 2);

    /**
     * 渲染配置
     */
    #show_vertices  = true;
    #show_edges     = true;
    #show_faces     = true;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} connector 
     * @param {*} renderer 
     */
    constructor(coordinator, connector, renderer) {
        super();

        // 控制器
        this.#coordinator = coordinator;
        this.#connector   = connector;

        // 显存
        this.#a_points       .setUsage(XThree.StreamDrawUsage);
        this.#a_points_normal.setUsage(XThree.StreamDrawUsage);

        // 构建结构
        this.add(this.#v );
        this.add(this.#l );
        this.add(this.#s0);
        this.add(this.#s1);
    }

    /**
     * 
     * 从指定的元素中获取matrix
     * 
     * @param {*} object 
     * @param {boolean} update 
     */
    copyMatrixFromObject(object, update = false) {
        if (true === update) {
            object.updateWorldMatrix(true, false);
        }
        this.setMatrix(object.matrixWorld);
    }

    /**
     * 
     * 设置变换矩阵
     * 
     * @param {*} mat4 
     */
    setMatrix(mat4) {
        this.matrix.identity();
        this.applyMatrix4(mat4);
    }

    /**
     * 
     * 显示顶点
     * 
     * @param {*} show 
     */
    showVertices(show) {
        show = true == show;
        if (this.#show_vertices == show) {
            ;
        } else {
            this.#show_vertices = show;
            this.#v.visible = show;
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 显示边
     * 
     * @param {*} show 
     */
    showEdges(show) {
        show = true == show;
        if (this.#show_edges == show) {
            ;
        } else {
            this.#show_edges = show;
            this.#l.visible = show;
            this.renderNextFrame();
        }
    }

    /**
     * 标记数据需要更新
     */
    markNeedUpdate() {
        this.#need_update = true;
        this.renderNextFrame();
    }

    /**
     * 更新几何
     */
    #update() {
        if (!this.#need_update) {
            return;
        }

        const e = this.#show_edges;
        this.#connector_renderable = this.#connector.renderable();
        this.#connector_renderable.prepare(true, e, true);
        this.#updateVertices();
        this.#updateVerticesNormal();
        this.#updateEdges();
        this.#updateFaces();
        this.#need_update = false;
    }

    /**
     * 更新点的几何
     */
    #updateVertices() {
        const version = this.#connector_renderable.version_vertices();
        if (this.#version_vertices == version) {
            return;
        }
        this.#version_vertices = version;

        // 设置数据
        const buffer = this.#connector_renderable.vertices();
        if (this.#a_points_count < buffer.length) {
            this.#a_points_count = Math.NextPowerOfTwo(buffer.length);
            this.#a_points = new XThree.BufferAttribute(new Float32Array(this.#a_points_count), 3);
            this.#v .updateAttributePoints(this.#a_points);
            this.#l .updateAttributePoints(this.#a_points);
            this.#sg.updateAttributePoints(this.#a_points);
        }

        // 更新数据
        this.#a_points.set(buffer, 0);
        this.#a_points.addUpdateRange(0, buffer.length);
        this.#a_points.needsUpdate = true;
    }

    /**
     * 更新点的法线
     */
    #updateVerticesNormal() {
        const version = this.#connector_renderable.vertices_normal();
        if (this.#version_vertices_normal == version) {
            return;
        }
        this.#version_vertices_normal = version;

        // 设置数据
        const buffer = this.#connector_renderable.vertices_normal();
        if (this.#a_points_normal_count < buffer.length) {
            this.#a_points_normal_count = Math.NextPowerOfTwo(buffer.length);
            this.#a_points_normal = new XThree.BufferAttribute(new Float32Array(this.#a_points_normal_count), 3);
            this.#sg.updateAttributePointsNormal(this.#a_points_normal);
        }

        // 更新数据
        this.#a_points_normal.set(buffer, 0);
        this.#a_points_normal.addUpdateRange(0, buffer.length);
        this.#a_points_normal.needsUpdate = true;
    }

    /**
     * 更新线的几何
     */
    #updateEdges() {
        if (!this.#show_edges) {
            return;
        }
        
        const version = this.#connector_renderable.version_edges_indices();
        if (this.#version_edges_inices == version) {
            return;
        }
        this.#version_edges_inices = version;
        this.#l.setIndices(this.#connector_renderable.edges_indices());
    }

    /**
     * 更新面的几何
     */
    #updateFaces() {
        const version = this.#connector_renderable.version_vertices_indices();
        if (this.#version_vertices_indices == version) {
            return;
        }
        this.#version_vertices_indices = version;
        this.#sg.setIndices(this.#connector_renderable.vertices_indices());
    }

    /**
     * 
     * 渲染之前准备
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameBegin(renderer_pipeline, renderer, camera) {
        this.#update();
    }

    /**
     * 
     * 渲染结束
     * 
     * @param {*} renderer_pipeline 
     * @param {*} renderer 
     * @param {*} camera 
     */
    onFrameEnd(renderer_pipeline, renderer, camera) {
        ;
    }

    /**
     * 下一帧渲染
     */
    renderNextFrame() {
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        for (let child of this.children) {
            if (!isFunction(child.dispose)) {
                continue;
            }
            child.dispose();
        }
        this.#sg.dispose();
    }
}
