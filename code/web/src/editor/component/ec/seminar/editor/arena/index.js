/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import XThree                from '@xthree/basic';
import GlobalScope           from '@common/global-scope';
import P                     from '../renderable/points';
import L                     from '../renderable/line-segments';
import S                     from '../renderable/surface';
import S2                    from '../renderable/surface-flatten';
import LAA                   from '../renderable/line-segments-antialias';
import SurfaceSubdivision    from '../renderable/surface-subdivision';
import DepthCapturer         from './depth-capturer';
import DepthBufferMaintainer from './depth-buffer-maintainer';

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
     * 细分系数
     */
    #subdivision_level = 0;

    /**
     * 标记是不是需要更新
     */
    #need_update = true;

    /**
     * 数据同步的版本
     */
    #version_vertices             = 0;
    #version_vertices_i           = 0;
    #version_vertices_status      = 0;
    #version_edges_i              = 0;
    #version_edges_detail_cluster = 0;
    #version_faces                = 0;
    #version_faces_depth          = 0;
    #version_subdivison_faces     = 0;

    /**
     * 共享数据
     */
    #a_points_count        = 0;
    #a_points              = new XThree.BufferAttribute(new Float32Array(), 3);
    #a_points_status_count = 0;
    #a_points_status       = new XThree.BufferAttribute(new Float32Array(), 1);
    
    /**
     * 可渲染
     */
    #v0 = new P(this.#a_points, this.#a_points_status); // 点
    #e0 = new L(this.#a_points, this.#a_points_status); // 细边，在渲染点和面的时候 用来增强质感
    #ea = new LAA(false);                               // 未选的边 高质量
    #eb = new LAA(true);                                // 选中的边 高质量
    #f0 = new S2(true);                                 // 选中的面 高质量
    #f1 = new S2();                                     // 未选的面 高质量
    #fs = new SurfaceSubdivision();                     // 细分

    /**
     * 渲染模式
     * 
     * 字符串： "V" / "E" / "F"
     * 
     */
    #render_mode = undefined;

    /**
     * 渲染配置
     */
    #show_vertices  = true;
    #show_edges     = true;
    #show_faces     = true;

    /**
     * 记录是不是用来捕获几何的几何发生了变化, 需要重新绘制
     */
    #depth_buffer_dirty_causeof_geo_changed = true;

    /**
     * 深度捕捉
     */
    #depth_capturer;

    /**
     * 深度缓存，更高级别的维护
     */
    #depth_buffer_maintainer = undefined;

    /**
     * 获取细分等级
     */
    get subdivisionLevel() {
        return this.#subdivision_level;
    }

    /**
     * 判断深度缓存数据是不是脏了
     */
    get isDepthBufferDirty() {
        return this.#depth_buffer_dirty_causeof_geo_changed;
    }

    /**
     * 
     * 获取显示模式
     * 
     * 'V' / 'E' / 'F'
     * 
     */
    get renderMode() {
        return this.#render_mode;
    }

    /**
     * 获取
     */
    get depth_buffer_maintainer() {
        if (undefined == this.#depth_buffer_maintainer) {
            this.#depth_buffer_maintainer = new DepthBufferMaintainer(this.#coordinator, this);
        }
        return this.#depth_buffer_maintainer;
    }

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
        this.#a_points_status.setUsage(XThree.StreamDrawUsage);

        // 构建结构
        this.add(this.#v0);
        this.add(this.#e0);
        this.add(this.#ea);
        this.add(this.#eb);
        this.add(this.#f0);
        this.add(this.#f1);
        this.add(this.#fs);
        
        // 深度
        this.#depth_capturer = new DepthCapturer(connector, renderer);

        // 设置显示模式
        this.setRenderMode('v');
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
        this.#depth_capturer.setMatrix(mat4);
        this.matrix.identity();
        this.applyMatrix4(mat4);
    }

    /**
     * 
     * 设置显示模式
     * 
     * @param {String} mode 
     */
    setRenderMode(mode) {
        if (!isString(mode) || this.#render_mode == mode) {
            return;
        }

        switch (mode) {
        case 'V':                       // 点模式
        case 'v':
            this.#v0.setShowBig();
            this.#v0.visible = true ;
            this.#e0.visible = true ;
            this.#ea.visible = false;
            this.#eb.visible = false;
            this.#f0.visible = true ;
            this.#f1.visible = true ;
            this.#fs.visible = this.#subdivision_level > 0;
            break;

        case 'E':                       // 边模式
        case 'e':
            this.#v0.visible = false;
            this.#e0.visible = false;
            this.#ea.visible = true ;
            this.#eb.visible = true ;
            this.#f0.visible = true ;
            this.#f1.visible = true ;
            this.#fs.visible = this.#subdivision_level > 0;
            break;

        case 'F':                       // 面模式
        case 'f':
            this.#v0.visible = false;
            this.#e0.visible = true ;
            this.#ea.visible = false;
            this.#eb.visible = false;
            this.#f0.visible = true ;
            this.#f1.visible = true ;
            this.#fs.visible = this.#subdivision_level > 0;
            break;

        default:                        // 其他
            this.#v0.visible = false;
            this.#e0.visible = false;
            this.#ea.visible = false;
            this.#eb.visible = false;
            this.#f0.visible = true ;
            this.#f1.visible = true ;
            this.#fs.visible = this.#subdivision_level > 0;
            break;
        }

        this.#render_mode = mode;
        this.renderNextFrame();
    }

    /**
     * 
     * 设置细分登记
     * 
     * @param {Number} level 
     * @returns 
     */
    setSubdivisionLevel(level) {
        level = parseInt(level);
        if (this.#subdivision_level != level) {
            this.#subdivision_level  = level;
            if (this.#subdivision_level > 0) {
                this.#fs.visible = true;
                this.#f0.setTransparentMode(true);
                this.#f1.setTransparentMode(true);
            } else {
                this.#fs.visible = false;
                this.#f0.setTransparentMode(false);
                this.#f1.setTransparentMode(false);
            }
            this.markNeedUpdate();
            this.renderNextFrame();
        }
    }

    /**
     * 
     * 透视 
     * 
     * ! 只设置未选的面
     * 
     * @param {Boolean} see_through 
     */
    setSeeThrough(see_through) {
        if (see_through || this.#subdivision_level > 0) {
            this.#f1.setTransparentMode(true);
        } else {
            this.#f1.setTransparentMode(false);
        }
        this.renderNextFrame();
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

        let v = this.#show_vertices;
        let e = this.#show_edges;
        let f = this.#show_faces;
        let d = this.#subdivision_level;
        if (!v && !e && !f) {
            return;
        }

        this.#connector_renderable = this.#connector.renderable();
        this.#connector_renderable.prepare(v, e, f, d);
        this.#updateVertices();
        this.#updateEdges();
        this.#updateFaces();
        this.#updateSubdivisionFaces();
        this.#need_update = false;
    }

    /**
     * 更新点的几何
     */
    #updateVertices() {
        // 点的位置
        if (this.#v0.visible || this.#e0.visible) {
            const version = this.#connector_renderable.version_vertices();
            if (this.#version_vertices != version) {
                const buffer = this.#connector_renderable.vertices();
                if (this.#a_points_count < buffer.length) {
                    this.#a_points_count = Math.NextPowerOfTwo(buffer.length);
                    this.#a_points = new XThree.BufferAttribute(
                        new Float32Array(this.#a_points_count), 3);
                    this.#v0.updateAttributePoints(this.#a_points);
                    this.#e0.updateAttributePoints(this.#a_points);
                }
                this.#a_points.set(buffer, 0);
                this.#a_points.addUpdateRange(0, buffer.length);
                this.#a_points.needsUpdate = true;
                this.#version_vertices = version;
            }
        }

        // 点的状态
        if (this.#v0.visible || this.#e0.visible) {
            const version = this.#connector_renderable.version_vertices_status();
            if (this.#version_vertices_status != version) {
                const buffer = this.#connector_renderable.vertices_status();
                if (this.#a_points_status_count < buffer.length) {
                    this.#a_points_status_count = Math.NextPowerOfTwo(buffer.length);
                    this.#a_points_status = new XThree.BufferAttribute(
                        new Float32Array(this.#a_points_status_count), 1);
                    this.#v0.updateAttributePointsStatus(this.#a_points_status);
                    this.#e0.updateAttributePointsStatus(this.#a_points_status);
                }
                this.#a_points_status.set(buffer, 0);
                this.#a_points_status.addUpdateRange(0, buffer.length);
                this.#a_points_status.needsUpdate = true;
                this.#version_vertices_status = version;
            }
        }

        // 有效点的索引
        if (this.#v0.visible) {
            const version = this.#connector_renderable.version_vertices_i();
            if (this.#version_vertices_i != version) {
                this.#v0.setIndices(this.#connector_renderable.vertices_i());
                this.#version_vertices_i = version;
            }
        }
    }

    /**
     * 更新线的几何
     */
    #updateEdges() {
        // 细线
        if (this.#e0.visible) {
            const version = this.#connector_renderable.version_edges_i();
            if (this.#version_edges_i != version) {
                this.#e0.setIndices(this.#connector_renderable.edges_i());
                this.#version_edges_i = version;
            }
        }
        
        // 粗线
        if (this.#ea.visible || this.#eb.visible) {
            const version = this.#connector_renderable.version_edges_detail_cluster();
            if (this.#version_edges_detail_cluster != version) {
                const s0 = this.#connector_renderable.edges_unselected();
                const s1 = this.#connector_renderable.edges_selected  ();
                this.#ea.setSegments(s0);
                this.#eb.setSegments(s1);
                this.#version_edges_detail_cluster = version;
            }
        }
    }

    /**
     * 更新面的几何
     */
    #updateFaces() {
        // 面
        if (this.#f0.visible || this.#f1.visible) {
            const version = this.#connector_renderable.version_faces();
            if (this.#version_faces != version) {
                // 选中的面
                const f0_v = this.#connector_renderable.selected_faces_v();
                const f0_n = this.#connector_renderable.selected_faces_n();
                const f0_i = this.#connector_renderable.selected_faces_i();
                this.#f0.setGeo(f0_v, f0_n);
                this.#f0.setIndices(f0_i);

                // 未选中的面
                const f1_v = this.#connector_renderable.unselected_faces_v();
                const f1_n = this.#connector_renderable.unselected_faces_n();
                const f1_i = this.#connector_renderable.unselected_faces_i();
                this.#f1.setGeo(f1_v, f1_n);
                this.#f1.setIndices(f1_i);

                // 深度捕获
                const _f0g_a_v = this.#f0.attribute_v;
                const _f0g_a_i = this.#f0.attribute_i;
                const _f0g_d_s = this.#f0.drawRangeStart;
                const _f0g_d_c = this.#f0.drawRangeCount;
                const _f1g_a_v = this.#f1.attribute_v;
                const _f1g_a_i = this.#f1.attribute_i;
                const _f1g_d_s = this.#f1.drawRangeStart;
                const _f1g_d_c = this.#f1.drawRangeCount;
                this.#depth_capturer.update(
                    _f0g_a_v, _f0g_a_i, _f0g_d_s, _f0g_d_c,
                    _f1g_a_v, _f1g_a_i, _f1g_d_s, _f1g_d_c);
            }
        }

        // 深度捕获
        const version = this.#connector_renderable.version_faces_depth();
        if (this.#version_faces_depth != version) {
            this.#version_faces_depth = version;
            this.#depth_buffer_dirty_causeof_geo_changed = true;
        }
    }

    /**
     * 更新
     */
    #updateSubdivisionFaces() {
        if (this.#fs.visible) {
            const version = this.#connector_renderable.version_subdivison_faces();
            if (this.#version_subdivison_faces != version) {
                const v = this.#connector_renderable.subdivison_faces_v();
                const n = this.#connector_renderable.subdivison_faces_v_n();
                const i = this.#connector_renderable.subdivison_faces_i();
                this.#fs.setData(v, i, n);
                this.#version_subdivison_faces = version;
            }
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
        // 数据更新
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
     * 
     * 更新深度图并立刻读取
     * 
     * !!!
     * 
     * 非特殊原因，外部使用 depth_buffer_maintainer 维护
     * 
     * @param {*} camera 
     */
    depthBufferCaptureAndAsyncReadBuffer(camera) {
        this.#depth_capturer.capture(camera);
        this.#depth_capturer.readBuffer();
        this.#depth_buffer_dirty_causeof_geo_changed = false;
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
        this.#depth_capturer.dispose();
    }
}
