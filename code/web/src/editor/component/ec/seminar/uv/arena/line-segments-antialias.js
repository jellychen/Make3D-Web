/* eslint-disable no-unused-vars */

import XThree                   from '@xthree/basic';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry';
import { LineMaterial }         from 'three/addons/lines/LineMaterial';

/**
 * 绘制多条线段
 */
export default class LineSegmentsAntialias extends XThree.Mesh {
    /**
     * Buffer
     */
    #instance_buffer       = undefined;
    #instance_buffer_count = 0;
    #instance_attr_start   = undefined;
    #instance_attr_end     = undefined;

    /**
     * 宽度
     */
    #width = 0.8;

    /**
     * 
     * 构造函数
     * 
     * @param {*} color 
     */
    constructor(color) {
        super(new LineSegmentsGeometry(), new LineMaterial());

        // 渲染次序
        this.renderOrder = 5;

        // 关闭踢出
        this.frustumCulled = false;

        // 材质控制
        this.material.transparent         = true;
        this.material.color               = new XThree.Color(color);
        this.material.vertexColors        = false;
        this.material.alphaToCoverage     = false;
        this.material.dashed              = false;
        this.material.depthWrite          = false;
        this.material.polygonOffset       = true;
        this.material.polygonOffsetFactor = -2;
        this.material.polygonOffsetUnits  = -1;
    }

    /**
     * 
     * 设置
     * 
     * @param {Boolean} enable 
     * @param {Number} factor 
     * @param {Number} units 
     */
    setPolygonOffset(enable, factor, units = 1) {
        this.material.polygonOffset = true == enable;
        this.material.polygonOffsetFactor = parseFloat(factor);
        this.material.polygonOffsetUnits  = parseFloat(units);
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.material.color.setHex(color);
        return this;
    }

    /**
     * 
     * 开启或者关闭深度写入
     * 
     * @param {boolean} enable 
     */
    setEnableWriteDepth(enable) {
        this.material.depthWrite = true == enable;
    }

    /**
     * 
     * 开启或者关闭深度剔除
     * 
     * @param {*} enable 
     * @param {*} func 
     */
    setEnableDepthTest(enable, func = XThree.LessDepth) {
        this.material.depthTest = true == enable;
        this.material.depthFunc = func;
    }

    /**
     * 
     * 构建
     * 
     * @param {Number} count 
     */
    #buildGeo(count) {
        if (this.geometry) {
            this.geometry.dispose();
            this.geometry = undefined;
        }
        
        this.#instance_buffer = new XThree.InstancedInterleavedBuffer(new Float32Array(count),   6, 1);
        this.#instance_attr_start = new XThree.InterleavedBufferAttribute(this.#instance_buffer, 3, 0);
        this.#instance_attr_end   = new XThree.InterleavedBufferAttribute(this.#instance_buffer, 3, 3);
        this.geometry = new LineSegmentsGeometry();
        this.geometry.boundingBox = new XThree.Box3();
        this.geometry.boundingSphere = new XThree.Sphere();
        this.geometry.setAttribute('instanceStart', this.#instance_attr_start); // xyz
        this.geometry.setAttribute('instanceEnd',   this.#instance_attr_end  ); // xyz
        this.geometry.instanceCount = 0;
    }

    /**
     * 
     * 设置线段的点
     * 
     * @param {Float32Array} points 
     */
    setSegments(points) {
        if (points) {

            // 判断是不是需要更新几何体尺寸
            if (this.#instance_buffer_count < points.length) {
                this.#instance_buffer_count = Math.NextPowerOfTwo(points.length / 6) * 6;
                this.#buildGeo(this.#instance_buffer_count);
            }

            // 更新几何
            this.#instance_buffer.set(points, 0);
            this.#instance_buffer.addUpdateRange(0, points.length);
            this.#instance_buffer.needsUpdate = true;
            this.#instance_attr_start.needsUpdate = true;
            this.#instance_attr_end.needsUpdate = true;

            // 调整绘制的次数
            this.geometry.instanceCount = points.length / 6;

        } else {

            // 调整绘制的次数
            this.geometry.instanceCount = 0;
        }
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
        const r = renderer_pipeline.pixelRatio;
        const w = renderer_pipeline.w;
        const h = renderer_pipeline.h;
        this.material.linewidth = this.#width * r;
        this.material.resolution.set(w * r, h * r);
        this.material.needsUpdate = true;
    }

    /**
     * 销毁
     */
    dispose() {
        super.dispose();
    }
}
