/* eslint-disable no-unused-vars */

import XThree        from '@xthree/basic';
import PointMaterial from '@xthree/material/round-point';
import Constants     from './constants';

/**
 * 点
 */
export default class Points extends XThree.Points {
    /**
     * 材质
     */
    #material = new PointMaterial();

    /**
     * 后续设置
     */
    #buffer_attribute_i       = new XThree.BufferAttribute(new Uint32Array(), 1);
    #buffer_attribute_i_count = 0;

    /**
     * 尺寸
     */
    #size       = 4;
    #pixel_size = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} vertices 
     * @param {*} vertices_status 
     */
    constructor(vertices, vertices_status) {
        super();

        // 渲染次序
        this.renderOrder   = 3;

        // 关闭踢出
        this.frustumCulled = false;

        // 属性
        this.#size = Constants.POINT_SIZE_SMALL;

        // 规避Threejs自动计算
        this.geometry.boundingBox    = new XThree.Box3();
        this.geometry.boundingSphere = new XThree.Sphere();
        this.geometry.setAttribute('position', vertices);
        this.geometry.setAttribute('pointHighlight', vertices_status);
        this.geometry.setIndex(this.#buffer_attribute_i);
        this.geometry.setDrawRange(0, 0);

        // 材质
        this.material = this.#material;
        this.material.setColor(Constants.COLOR_POINT_NORMAL);
        this.material.setColorHighlight(Constants.COLOR_POINT_HIGHLIGHT);
        this.material.setFeather(0.5);
    }

    /**
     * 
     * 更新几何
     * 
     * @param {*} attribute_points 
     */
    updateAttributePoints(attribute_points) {
        this.geometry.setAttribute('position', attribute_points);
    }

    /**
     * 
     * 更新几何
     * 
     * @param {*} attribute_points_status 
     */
    updateAttributePointsStatus(attribute_points_status) {
        this.geometry.setAttribute('pointHighlight', attribute_points_status);
    }

    /**
     * 
     * 点数据改变
     * 
     * @param {*} attribute_points 
     * @param {*} attribute_points_status 
     */
    update(attribute_points, attribute_points_status) {
        this.geometry.setAttribute('position', attribute_points);
        this.geometry.setAttribute('pointHighlight', attribute_points_status);
    }

    /**
     * 
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setSize(size) {
        this.#size = parseFloat(size);
        return this;
    }

    /**
     * 
     * 设置渲染的索引
     * 
     * @param {*} indices32 
     */
    setIndices(indices32) {
        if (indices32) {
            // 判断是不是需要更新几何体尺寸
            if (this.#buffer_attribute_i.count < indices32.length) {
                this.#buffer_attribute_i_count = Math.NextPowerOfTwo(indices32.length);;
                this.#buffer_attribute_i = new XThree.BufferAttribute(new Uint32Array(this.#buffer_attribute_i_count), 1);
                this.#buffer_attribute_i.setUsage(XThree.StreamDrawUsage);
                this.geometry.setIndex(this.#buffer_attribute_i);
            }

            // 更新几何体
            this.#buffer_attribute_i.set(indices32, 0);
            this.#buffer_attribute_i.addUpdateRange(0, indices32.length);
            this.#buffer_attribute_i.needsUpdate = true;

            // 更新渲染区域
            this.geometry.setDrawRange(0, indices32.length);

        } else {
            // 更新渲染区域
            this.geometry.setDrawRange(0, 0);
        }
    }

    /**
     * 设置显示小点
     */
    setShowSmall() {
        this.setSize(Constants.POINT_SIZE_SMALL);
    }

    /**
     * 设置显示大点
     */
    setShowBig() {
        this.setSize(Constants.POINT_SIZE_BIG);
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
        const ps = this.#size * renderer_pipeline.pixelRatio;
        if (this.#pixel_size === ps) {
            return;
        } else {
            this.#pixel_size = ps;
        }
        
        if (this.material) {
            this.material.setPointSize(this.#pixel_size);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
