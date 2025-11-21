/* eslint-disable no-unused-vars */

import XThree        from '@xthree/basic';
import AspectColor_0 from '@xthree/material/aspect-color-not-smooth';
import AspectColor_1 from '@xthree/material/aspect-color';
import Constants     from './constants';

/**
 * 绘制细分
 */
export default class SurfaceSubdivision extends XThree.Mesh {
    /**
     * 材质
     */
    #materital_0              = new AspectColor_0();
    #materital_1              = new AspectColor_1();

    /**
     * 后续设置使用
     */
    #buffer_attribute_v       = new XThree.BufferAttribute(new Float32Array(), 3); // 位置
    #buffer_attribute_v_count = 0;
    #buffer_attribute_n       = new XThree.BufferAttribute(new Float32Array(), 3); // 法线
    #buffer_attribute_n_count = 0;
    #buffer_attribute_i       = new XThree.BufferAttribute(new Uint32Array(), 1);
    #buffer_attribute_i_count = 0;

    /**
     * 构造函数
     */
    constructor() {
        super();

        // 渲染次序
        this.renderOrder                      = 0;

        // 关闭踢出
        this.frustumCulled                    = false;

        // 调整材质
        this.#materital_0.polygonOffset       = true;
        this.#materital_0.polygonOffsetFactor = 10;
        this.#materital_0.polygonOffsetUnits  = 10;
        this.#materital_0.side                = XThree.DoubleSide;
        this.#materital_0.setFrontColor(Constants.COLOR_FACE_SUBDIVISION);
        this.#materital_1.polygonOffset       = true;
        this.#materital_1.polygonOffsetFactor = 10;
        this.#materital_1.polygonOffsetUnits  = 10;
        this.#materital_1.side                = XThree.DoubleSide;
        this.#materital_1.setFrontColor(Constants.COLOR_FACE_SUBDIVISION);

        // 调整材质参数
        this.material                         = this.#materital_0;
        this.geometry                         = new XThree.BufferGeometry();

        // 预分配
        this.geometry.boundingBox             = new XThree.Box3();
        this.geometry.boundingSphere          = new XThree.Sphere();
        this.geometry.setAttribute('position', this.#buffer_attribute_v);
        this.geometry.setIndex(this.#buffer_attribute_i);
        this.geometry.setDrawRange(0, 0);
    }

    /**
     * 
     * 设置正面颜色
     * 
     * @param {*} color 
     */
    setFrontColor(color) {
        this.#materital_0.setFrontColor(color);
        this.#materital_1.setFrontColor(color);
    }

    /**
     * 
     * 设置背面颜色
     * 
     * @param {*} color 
     */
    setBackColor(color) {
        this.#materital_0.setBackColor(color);
        this.#materital_1.setBackColor(color);
    }

    /**
     * 
     * 开启或者关闭深度写入
     * 
     * @param {*} enable 
     */
    setEnableDepthWrite(enable) {
        this.#materital_0.depthWrite = enable;
        this.#materital_1.depthWrite = enable;
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
        ;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} vertices 
     * @param {*} indices32 
     * @param {*} vertices_normal 
     */
    setData(vertices, indices32, vertices_normal) {
        // 设置定点数据
        if (vertices) {
            const buffer = vertices;
            if (this.#buffer_attribute_v_count < buffer.length) {
                this.#buffer_attribute_v_count = Math.NextPowerOfTwo(buffer.length);
                this.#buffer_attribute_v = new XThree.BufferAttribute(
                    new Float32Array(this.#buffer_attribute_v_count), 3);
                this.geometry.setAttribute('position', this.#buffer_attribute_v);
            }
            this.#buffer_attribute_v.set(buffer, 0);
            this.#buffer_attribute_v.addUpdateRange(0, buffer.length);
            this.#buffer_attribute_v.needsUpdate = true;
        }

        // 点的法线
        if (vertices_normal) {
            const buffer = vertices_normal;
            if (this.#buffer_attribute_n_count < buffer.length) {
                this.#buffer_attribute_n_count = Math.NextPowerOfTwo(buffer.length);
                this.#buffer_attribute_n = new XThree.BufferAttribute(
                    new Float32Array(this.#buffer_attribute_v_count), 3);
            }
            this.#buffer_attribute_n.set(buffer, 0);
            this.#buffer_attribute_n.addUpdateRange(0, buffer.length);
            this.#buffer_attribute_n.needsUpdate = true;
            this.material = this.#materital_1;
            this.geometry.setAttribute('normal', this.#buffer_attribute_n);
        } else {
            this.geometry.deleteAttribute('normal');
            this.material = this.#materital_0;
        }

        // 更新索引
        if (indices32) {
            const buffer = indices32;
            if (this.#buffer_attribute_i.count < buffer.length) {
                this.#buffer_attribute_i_count = Math.NextPowerOfTwo(buffer.length);
                this.#buffer_attribute_i = new XThree.BufferAttribute(
                    new Uint32Array(this.#buffer_attribute_i_count), 1);
                this.#buffer_attribute_i.setUsage(XThree.StreamDrawUsage);
                this.geometry.setIndex(this.#buffer_attribute_i);
            }
            this.#buffer_attribute_i.set(buffer, 0);
            this.#buffer_attribute_i.addUpdateRange(0, buffer.length);
            this.#buffer_attribute_i.needsUpdate = true;
            this.geometry.setDrawRange(0, indices32.length);
        } else {
            this.geometry.setDrawRange(0, 0);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
