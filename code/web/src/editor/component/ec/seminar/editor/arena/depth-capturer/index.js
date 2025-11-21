/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree               from '@xthree/basic';
import MatrialDepth         from '@xthree/material/depth-capture-render';
import DebugCanvasImageData from './debug-canvas-image-data';
import RT_Depth             from "./rt-depth";
import RT_DepthToColor      from "./rt-depth-to-color";
import RT_Copier            from "./rt-copier";

/**
 * 默认使用的深度数据尺寸
 */
const DEFAULT_W = 1024;
const DEFAULT_H = 1024;

/**
 * 用来捕获深度数据
 */
export default class DepthCapture {
    /**
     * rt
     */
    #rt_depth;
    #rt_depth_to_color;
    #rt_copier;

    /**
     * 渲染器
     */
    #renderer;

    /**
     * 控制器
     */
    #abattoir;
    #abattoir_depth_buffer;

    /**
     * 场景
     */
    #scene                 = new XThree.Scene();
    #mesh_0                = new XThree.Mesh();
    #mesh_1                = new XThree.Mesh();
    #depth_capture_matrial = new MatrialDepth();

    /**
     * 
     * 构造函数
     * 
     * @param {*} abattoir 
     * @param {*} renderer 
     */
    constructor(abattoir, renderer) {
        // 构建rt
        this.#rt_depth              = new RT_Depth(DEFAULT_W, DEFAULT_H);
        this.#rt_depth_to_color     = new RT_DepthToColor(DEFAULT_W, DEFAULT_H);
        this.#rt_copier             = new RT_Copier();

        // 属性
        this.#renderer              = renderer;
        this.#abattoir              = abattoir;
        this.#abattoir_depth_buffer = abattoir.getDepthBuffer();
        this.#abattoir_depth_buffer.resize(DEFAULT_W, DEFAULT_H, 0);

        // 构建场景
        this.#scene.add(this.#mesh_0);
        this.#mesh_0.geometry.computeBoundingBox();
        this.#mesh_0.geometry.computeBoundingSphere();
        this.#mesh_0.frustumCulled = false;
        this.#scene.add(this.#mesh_1);
        this.#mesh_1.geometry.computeBoundingBox();
        this.#mesh_1.geometry.computeBoundingSphere();
        this.#mesh_1.frustumCulled = false;

        // 默认的多边形偏移
        this.setPolygonOffset(2, 0);
    }

    /**
     * 获取尺寸
     */
    get w() {
        return DEFAULT_W;
    }

    /**
     * 获取尺寸  
     */
    get h() {
        return DEFAULT_H;
    }

    /**
     * 
     * 设置多边形
     * 
     * @param {Number} factor 
     * @param {Number} units 
     */
    setPolygonOffset(factor, units) {
        this.#depth_capture_matrial.setPolygonOffset(factor, units);
    }

    /**
     * 
     * 设置变换矩阵
     * 
     * @param {*} mat4 
     */
    setMatrix(mat4) {
        this.#mesh_0.matrix.identity();
        this.#mesh_0.applyMatrix4(mat4);
        this.#mesh_1.matrix.identity();
        this.#mesh_1.applyMatrix4(mat4);
    }

    /**
     * 
     * 更新几何
     * 
     * @param {*} m0_v 
     * @param {*} m0_i 
     * @param {*} m0_draw_range_start 
     * @param {*} m0_draw_range_count 
     * @param {*} m1_v 
     * @param {*} m1_i 
     * @param {*} m1_draw_range_start 
     * @param {*} m1_draw_range_count 
     */
    update(m0_v, m0_i, m0_draw_range_start, m0_draw_range_count, 
           m1_v, m1_i, m1_draw_range_start, m1_draw_range_count) {
        const m0g = this.#mesh_0.geometry;
        const m1g = this.#mesh_1.geometry;
        m0g.setAttribute('position', m0_v);
        m0g.setIndex(m0_i);
        m0g.setDrawRange(m0_draw_range_start, m0_draw_range_count);
        m1g.setAttribute('position', m1_v);
        m1g.setIndex(m1_i);
        m1g.setDrawRange(m1_draw_range_start, m1_draw_range_count);
    }

    /**
     * 
     * 捕获深度
     * 
     * @param {*} camera 
     */
    capture(camera) {
        // 重置相机
        camera.layers.enableAll();

        // 
        let renderer               = this.#renderer;
        let scene                  = this.#scene;

        // 备份
        let old_render_target      = renderer.getRenderTarget();
        let old_material           = scene.overrideMaterial;
        scene.overrideMaterial     = this.#depth_capture_matrial;
        renderer.shadowMap.enabled = false;

        // 绘制深度图
        renderer.setRenderTarget(this.#rt_depth.render_target);
        renderer.autoClear         = true;
        renderer.autoClearColor    = true;
        renderer.autoClearDepth    = true;
        renderer.setClearColor(0xFFFFFF, 1);
        renderer.render(scene, camera);
        renderer.setRenderTarget(this.#rt_depth_to_color.render_target);

        // 拷贝深度图
        this.#rt_copier.setFrustumNearAndFarFromCamera(camera);
        this.#rt_copier.setDepthTexture(this.#rt_depth.texture);
        this.#rt_copier.render(renderer);

        // 恢复
        renderer.setRenderTarget(old_render_target);
        scene.overrideMaterial     = old_material;
    }

    /**
     * 读取内存
     */
    readBuffer() {
        this.#renderer.readRenderTargetPixels(
            this.#rt_depth_to_color.render_target,
            0,
            0,
            DEFAULT_W,
            DEFAULT_H,
            this.#abattoir_depth_buffer.buffer());
    }

    /**
     * 销毁
     */
    dispose() {
        this.#rt_depth.dispose();
        this.#rt_depth_to_color.dispose();
        this.#rt_copier.dispose();
        this.#mesh_0.dispose(true, true);
        this.#mesh_1.dispose(true, true);
    }
}
