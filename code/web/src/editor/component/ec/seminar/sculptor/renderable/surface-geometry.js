/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * Surface 几何
 */
export default class SurfaceGeometry extends XThree.BufferGeometry {
    /**
     * 索引
     */
    #buffer_attribute_i = new XThree.BufferAttribute(new Uint32Array(), 1);
    #buffer_attribute_i_count = 0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} vertices 
     * @param {*} vertices_normal 
     */
    constructor(vertices, vertices_normal) {
        super();
        this.boundingBox = new XThree.Box3();
        this.boundingSphere = new XThree.Sphere();
        this.setAttribute('position', vertices);
        this.setAttribute('normal'  , vertices_normal);
        this.setIndex(this.#buffer_attribute_i);
        this.setDrawRange(0, 0);
    }

    /**
     * 
     * 更新顶点数据
     * 
     * @param {*} attribute_points 
     */
    updateAttributePoints(attribute_points) {
        this.setAttribute('position', attribute_points);
    }

    /**
     * 
     * 更新几何
     * 
     * @param {*} attribute_points_normal 
     */
    updateAttributePointsNormal(attribute_points_normal) {
        this.setAttribute('normal', attribute_points_normal);
    }

    /**
     * 
     * 设置渲染区域
     * 
     * @param {*} start 
     * @param {*} count 
     */
    setDrawRange(start, count) {
        super.setDrawRange(start, count);
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
                this.#buffer_attribute_i_count = Math.NextPowerOfTwo(indices32.length);
                this.#buffer_attribute_i = new XThree.BufferAttribute(new Uint32Array(this.#buffer_attribute_i_count), 1);
                this.#buffer_attribute_i.setUsage(XThree.StreamDrawUsage);
                this.setIndex(this.#buffer_attribute_i);
            }

            // 更新几何体
            this.#buffer_attribute_i.set(indices32, 0);
            this.#buffer_attribute_i.addUpdateRange(0, indices32.length);
            this.#buffer_attribute_i.needsUpdate = true;

            // 更新渲染区域
            this.setDrawRange(0, indices32.length);
        } else {
            this.setDrawRange(0, 0);
        }
    }
}
