/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import AspectColor from '@xthree/material/aspect-color';
import Line        from '@xthree/renderable/line/line-segments-immediate';
import GlobalScope from '@common/global-scope';

/**
 * 默认的缩放
 */
const DEFAULT_SCALE = 1.0 / 160;

/**
 * 协调整个场景
 */
export default class Controller {
    /**
     * 曲线编辑器
     */
    #curve_editor;

    /**
     * 三维渲染器
     */
    #renderer;

    /**
     * 曲线细分
     */
    #segment_count = 8;

    /**
     * 环绕细分
     */
    #steps = 16;

    /**
     * 渲染用的网格
     */
    #mesh;

    /**
     * 渲染的
     */
    #mesh_wireframe;

    /**
     * 获得的Soup
     */
    #soup;

    /**
     * 获取
     */
    get soup() {
        return this.#soup;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} curve_editor 
     * @param {*} renderer_3d 
     */
    constructor(curve_editor, renderer_3d) {
        this.#curve_editor  = curve_editor;
        this.#renderer      = renderer_3d;
        this.#mesh          = new XThree.Mesh(new XThree.BufferGeometry());
        const material      = new AspectColor();
        material.polygonOffset       = true;
        material.polygonOffsetFactor = 2;
        material.polygonOffsetUnits  = 2;

        material.setEnhance(1);
        material.setFrontColor(0xA8A8A8);
        material.setBackColor (0x680000);

        this.#mesh.material = material
        this.#mesh_wireframe = new Line();
        this.#mesh_wireframe.setColor(0x0);

        const group = new XThree.Group();
        group.add(this.#mesh);
        group.add(this.#mesh_wireframe);
        this.#renderer.setRenderObject(group);
    }

    /**
     * 
     * 设置曲线分段
     * 
     * @param {*} count 
     */
    setSegmentCount(count) {
        this.#segment_count = parseInt(count);
    }

    /**
     * 
     * 设置环绕分段
     * 
     * @param {*} steps 
     */
    setSteps(steps) {
        this.#steps = parseInt(steps);
    }

    /**
     * 更新数据
     */
    update() {
        // 清除旧的
        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidLatheIsolator,
            GeoSolidSoupTriangulator,
            GeoSolidSoupWireframe,
        } = Chameleon;

        // 获取数据
        const points = this.#curve_editor.points;
        const curves_count = Math.floor(points.length / 3);
        if (curves_count == 0) {
            this.#mesh.visible = false;
            return;
        }

        // 构建
        const isolator = GeoSolidLatheIsolator.MakeShared();
        const path     = isolator.getPath();

        // 添加到Path
        path.moveTo(points[0].x * DEFAULT_SCALE, 
                    points[0].y * DEFAULT_SCALE);
        for (let i = 0; i < curves_count; ++i) {
            const a = points[i * 3 + 1];
            const b = points[i * 3 + 2];
            const c = points[i * 3 + 3];
            path.bezierTo(a.x * DEFAULT_SCALE, a.y * DEFAULT_SCALE, 
                          b.x * DEFAULT_SCALE, b.y * DEFAULT_SCALE, 
                          c.x * DEFAULT_SCALE, c.y * DEFAULT_SCALE);
        }

        // 设置参数
        isolator.setSegmentsCount(this.#segment_count);
        isolator.setSteps(this.#steps);

        // 构建
        const soup = isolator.build();
        if (!soup) {
            this.#mesh.visible = false;
            this.#mesh_wireframe.visible = false;
        } else {
            this.#mesh.visible = true;
            this.#mesh_wireframe.visible = true;

            // 计算面
            const indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());
            this.#mesh.geometry.setAttr('position', soup.vertices(), 3, true);
            this.#mesh.geometry.setIndices32(indices, true);
            this.#mesh.computeVertexNormalsAndReserveAcuteAngle();
            this.#mesh.geoChanged();

            // 计算wireframe
            const wireframe = GeoSolidSoupWireframe.MakeShared();
            wireframe.build(soup.getPtr());
            this.#mesh_wireframe.setSegments(wireframe.edges());

            // 销毁
            wireframe.delete();
        }

        // 保存当前的Soup
        this.#soup = soup;

        // 销毁
        isolator.delete();
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#soup) {
            this.#soup.delete();
            this.#soup = undefined;
        }

        if (this.#mesh) {
            this.#mesh.dispose();
            this.#mesh = undefined;
        }

        if (this.#mesh_wireframe) {
            this.#mesh_wireframe.dispose();
            this.#mesh_wireframe = undefined;
        }
    }
}
