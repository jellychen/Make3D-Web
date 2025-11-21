/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 内容物
 */
export default class Rect {
    /**
     * 请求重绘
     */
    #request_animation_frame;

    /**
     * 坐标
     */
    #start_x = 0;
    #start_y = 0;
    #end_x   = 0;
    #end_y   = 0;

    /**
     * 用来渲染的MESH
     */
    #mesh_geo_available_ = false;
    #mesh                = new XThree.Mesh();
    #mesh_material       = new XThree.MeshBasicMaterial();

    /**
     * 
     * 构造函数
     * 
     * @param {*} request_animation_frame 
     */
    constructor(request_animation_frame) {
        this.#mesh.material             = this.#mesh_material;
        this.#mesh_material.visible     = true;
        this.#mesh_material.depthTest   = false;
        this.#mesh_material.depthWrite  = false;
        this.#mesh_material.side        = XThree.FrontSide;
        this.#mesh_material.transparent = true;
        this.#mesh_material.opacity     = 0.1;
        this.#mesh_material.color       = new XThree.Color(0x686868);
        this.#request_animation_frame   = request_animation_frame;
    }

    /**
     * 
     * 设置显示的颜色和半透明
     * 
     * @param {*} color 
     * @param {*} alpha 
     */
    setColor(color, alpha) {
        this.#mesh_material.color.setHex(color);
        this.#mesh_material.alpha = alpha;
        this.#request_animation_frame();
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setStartPoint(x, y) {
        if (this.#start_x != x || this.#start_y != y) {
            this.#start_x = x;
            this.#start_y = y;
            this.#mesh_geo_available_ = false;
        }
    }

    /**
     * 
     * 笛卡尔坐标系，中心在屏幕中心
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setEndPoint(x, y) {
        if (this.#end_x != x || this.#end_y != y) {
            this.#end_x = x;
            this.#end_y = y;
            this.#mesh_geo_available_ = false;
        }
    }

    /**
     * 
     * 执行绘制
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.#mesh_geo_available_) {
            this.#mesh_geo_available_ = true;
            const x0 = Math.min(this.#start_x, this.#end_x);
            const x1 = Math.max(this.#start_x, this.#end_x);
            const y0 = Math.max(this.#start_y, this.#end_y);
            const y1 = Math.min(this.#start_y, this.#end_y);

            // 顶点
            const v = new Float32Array(12);
            v[0]    = x0;
            v[1]    = y0;
            v[2]    = 0;
            v[3]    = x0;
            v[4]    = y1;
            v[5]    = 0;
            v[6]    = x1;
            v[7]    = y1;
            v[8]    = 0;
            v[9]    = x1;
            v[10]   = y0;
            v[11]   = 0;

            // 索引
            const i = new Uint16Array(6);
            i[0]    = 0;
            i[1]    = 1;
            i[2]    = 2;
            i[3]    = 0;
            i[4]    = 2;
            i[5]    = 3;

            const geo = new XThree.BufferGeometry();
            geo.setAttribute('position', new XThree.BufferAttribute(v, 3));
            geo.setIndex(new XThree.BufferAttribute(i, 1));
            if (this.#mesh.geometry) {
                this.#mesh.geometry.dispose();
            }
            this.#mesh.geometry = geo;
        }
        renderer.render(this.#mesh, camera);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#mesh.dispose(true, true);
    }
}
