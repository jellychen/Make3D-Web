/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import AspectColor from '@xthree/material/aspect-color';
import Constants   from './constants';

/**
 * Surface
 */
export default class SurfaceFlatten extends XThree.Mesh {
    /**
     * 材质
     */
    #material                 = new AspectColor();

    /**
     * 高对比度
     */
    #selected                 = false;

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
     * 绘制区域
     */
    #draw_ragge_start         = 0;
    #draw_range_count         = 0;

    /**
     * 获取
     */
    get attribute_v() {
        return this.#buffer_attribute_v;
    }

    /**
     * 获取
     */
    get attribute_n() {
        return this.#buffer_attribute_n;
    }

    /**
     * 获取
     */
    get attribute_i() {
        return this.#buffer_attribute_i;
    }

    /**
     * 获取
     */
    get drawRangeStart() {
        return this.#draw_ragge_start;
    }

    /**
     * 获取
     */
    get drawRangeCount() {
        return this.#draw_range_count;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} selected 
     */
    constructor(selected = false) {
        super();

        // 记录
        this.#selected                    = selected;

        // 渲染次序
        this.renderOrder                  = 1;

        // 关闭踢出
        this.frustumCulled                = false;

        // 如果是选中的
        if (selected) {
            this.#material.setEnhance(0.3);
        }

        // 调整材质参数
        this.material                     = this.#material;
        this.material.polygonOffset       = true;
        this.material.polygonOffsetFactor = 2.0;
        this.material.polygonOffsetUnits  = 6.0;
        this.material.side                = XThree.DoubleSide;
        this.material.setEnableHighContrast(selected);

        // 预分配
        this.geometry                     = new XThree.BufferGeometry();
        this.geometry.boundingBox         = new XThree.Box3();
        this.geometry.boundingSphere      = new XThree.Sphere();
        this.geometry.setAttribute('position', this.#buffer_attribute_v);
        this.geometry.setAttribute('normal',   this.#buffer_attribute_n);
        this.geometry.setIndex(this.#buffer_attribute_i);
        this.geometry.setDrawRange(0, 0);

        // 初始化
        this.setTransparentMode(false);
    }

    /**
     * 
     * 设置透明模式
     * 
     * @param {*} enable 
     */
    setTransparentMode(enable) {
        if (!enable) {
            if (this.#selected) {
                this.#material.setFrontColor(Constants.COLOR_FACE_SELECTED);
            } else {
                this.#material.setFrontColor(Constants.COLOR_FACE_UNSELECTED);
            }
            this.material.setTransparent(false, 1.0);
            this.material.depthWrite = true;
            this.material.side = XThree.DoubleSide;
        } else {
            if (this.#selected) {
                this.material.setTransparent(true, Constants.COLOR_FACE_SELECTED_OPACITY);
                this.material.setFrontColor(Constants.COLOR_FACE_SELECTED_TRANSPARENT);
            } else {
                this.material.setTransparent(true, Constants.COLOR_FACE_UNSELECTED_OPACITY);
                this.material.setFrontColor(Constants.COLOR_FACE_UNSELECTED_TRANSPARENT);
            }
            this.material.depthWrite = false;
            this.material.side = XThree.FrontSide;
        }
    }

    /**
     * 
     * 设置正面颜色
     * 
     * @param {*} color 
     */
    setFrontColor(color) {
        this.material.setFrontColor(color);
    }

    /**
     * 
     * 设置背面颜色
     * 
     * @param {*} color 
     */
    setBackColor(color) {
        this.material.setBackColor(color);
    }

    /**
     * 
     * 设置半透明
     * 
     * @param {boolean} transparent 
     * @param {Number} opacity 
     */
    setTransparent(transparent, opacity) {
        this.material.setTransparent(true === transparent, opacity);
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
     * 点数据改变
     * 
     * @param {*} points 
     * @param {*} points_normal 
     */
    setGeo(points, points_normal) {
        // 点的位置数据
        if (points) {
            const buffer = points;
            if (this.#buffer_attribute_v_count < buffer.length) {
                this.#buffer_attribute_v_count = Math.NextPowerOfTwo(buffer.length);
                this.#buffer_attribute_v = new XThree.BufferAttribute(new Float32Array(this.#buffer_attribute_v_count), 3);
                this.geometry.setAttribute('position', this.#buffer_attribute_v);
            }
            this.#buffer_attribute_v.set(buffer, 0);
            this.#buffer_attribute_v.addUpdateRange(0, buffer.length);
            this.#buffer_attribute_v.needsUpdate = true;
        }

        // 点的法线数据
        if (points_normal) {
            const buffer = points_normal;
            if (this.#buffer_attribute_n_count < buffer.length) {
                this.#buffer_attribute_n_count = Math.NextPowerOfTwo(buffer.length);
                this.#buffer_attribute_n = new XThree.BufferAttribute(new Float32Array(this.#buffer_attribute_v_count), 3);
                this.geometry.setAttribute('normal', this.#buffer_attribute_n);
            }
            this.#buffer_attribute_n.set(buffer, 0);
            this.#buffer_attribute_n.addUpdateRange(0, buffer.length);
            this.#buffer_attribute_n.needsUpdate = true;
        }
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
                this.geometry.setIndex(this.#buffer_attribute_i);
            }

            // 更新几何体
            this.#buffer_attribute_i.set(indices32, 0);
            this.#buffer_attribute_i.addUpdateRange(0, indices32.length);
            this.#buffer_attribute_i.needsUpdate = true;

            // 标记
            this.#draw_ragge_start = 0;
            this.#draw_range_count = indices32.length;

            // 更新渲染区域
            this.geometry.setDrawRange(0, indices32.length);

        } else {
            // 标记
            this.#draw_ragge_start = 0;
            this.#draw_range_count = 0;

            // 更新渲染区域
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
