/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isFunction   from 'lodash/isFunction';
import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import S            from './surface';
import L            from './line-segments-antialias';
import Constants    from './constants';

/**
 * 渲染场景
 */
export default class Arena extends XThree.Group {
    /**
     * 核心的协调器
     */
    #coordinator;

    /**
     * c++ 元素
     */
    #connector;
    #connector_renderable;

    /**
     * 当前显示的线的版本
     */
    #edges_version = 0;

    /**
     * 元素
     */
    #s  = new S();
    #l0 = new L(Constants.COLOR_LINE_SEGMENT_HIGHLIGHT); // 当前选择的边
    #l1 = new L(Constants.COLOR_LINE_SEGMENT_MARKED)   ; // 缝合边
    #l2 = new L(Constants.COLOR_LINE_SEGMENT_NORMAL)   ; // 非缝合边

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} connector 
     * @param {*} cinderella_renderer 
     */
    constructor(coordinator, connector, cinderella_renderer) {
        super();
        this.#coordinator = coordinator;
        this.#connector   = connector;
        this.#connector_renderable = this.#connector.renderable();
        this.add(this.#s );
        this.add(this.#l0);
        this.add(this.#l1);
        this.add(this.#l2);

        // 更新Surface, 模型整个过程是不发生变化
        const renderable = this.#connector_renderable
        renderable.prepare();
        this.#edges_version = renderable.version_edges();
        this.#updateSurface(renderable.vertices(), 
                            renderable.vertices_indices());
        this.#updateL0(renderable.edges_0());
        this.#updateL1(renderable.edges_1());
        this.#updateL2(renderable.edges_2());
        this.renderNextFrame();
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
     * 更新
     * 
     * @param {*} vertices 
     * @param {*} indices 
     */
    #updateSurface(vertices, indices) {
        this.#s.setVerticesPosition(vertices);
        this.#s.setIndices(indices);
    }

    /**
     * 
     * 当前选择的边
     * 
     * @param {*} points 
     */
    #updateL0(points) {
        this.#l0.setSegments(points);
    }

    /**
     * 
     * 缝合边
     * 
     * @param {*} points 
     */
    #updateL1(points) {
        this.#l1.setSegments(points);
    }

    /**
     * 
     * 非缝合边
     * 
     * @param {*} points 
     */
    #updateL2(points) {
        this.#l2.setSegments(points);
    }

    /**
     * 更新边框
     */
    updateEdges() {
        const renderable = this.#connector_renderable;
        renderable.prepare();
        
        const version = renderable.version_edges();
        if (this.#edges_version == version) {
            return;
        } else {
            this.#edges_version = version;
        }

        this.#updateL0(renderable.edges_0());
        this.#updateL1(renderable.edges_1());
        this.#updateL2(renderable.edges_2());
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
    }
}
