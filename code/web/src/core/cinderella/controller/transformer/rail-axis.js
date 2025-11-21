/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 常量定义
 */
const _axis_width   = 3;
const _axis_length  = 2;
const _axis_region  = 3;
const _axis_x_color = 0xFE5B5D;
const _axis_y_color = 0x36E2B3;
const _axis_z_color = 0x239CFF;

/**
 * 指引的轨迹
 */
export default class RailAxis extends XThree.Group {
    /**
     * 宿主
     */
    #host;

    /**
     * 线段
     */
    #line_segments_x = new XThreeRenderable.LineSegments();
    #line_segments_y = new XThreeRenderable.LineSegments();
    #line_segments_z = new XThreeRenderable.LineSegments();

    /**
     * 坐标位置
     */
    #x                  = 0;
    #x_need_rebuild_geo = true;
    #y                  = 0;
    #y_need_rebuild_geo = true;
    #z                  = 0;
    #z_need_rebuild_geo = true;

    /**
     * 可视
     */
    #visible = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super();
        this.#host = host;
        this.#line_segments_x.setWidth(_axis_width  );
        this.#line_segments_x.setColor(_axis_x_color);
        this.#line_segments_y.setWidth(_axis_width  );
        this.#line_segments_y.setColor(_axis_y_color);
        this.#line_segments_z.setWidth(_axis_width  );
        this.#line_segments_z.setColor(_axis_z_color);
    }

    /**
     * 
     * 设置可见性
     * 
     * @param {boolean} visible 
     */
    setVisible(visible) {
        this.#visible = true === visible;
    }

    /**
     * 
     * 设置位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    setPosition(x, y, z) {
        if (this.#x !== x) {
            this.#x = x;
            this.#x_need_rebuild_geo = true;
        }

        if (this.#y !== y) {
            this.#y = y;
            this.#y_need_rebuild_geo = true;
        }

        if (this.#z !== z) {
            this.#z = z;
            this.#z_need_rebuild_geo = true;
        }
    }

    /**
     * 
     * 设置位置
     * 
     * @param {XThree.Vector3} point 
     */
    setPositionPoint(point) {
        this.setPosition(point.x, point.y, point.z);
    }

    /**
     * 
     * 尺寸缩放
     * 
     * @param {Number} pixel_ratio 
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(pixel_ratio, width, height) {
        this.#line_segments_x.setResolution(width, height);
        this.#line_segments_y.setResolution(width, height);
        this.#line_segments_z.setResolution(width, height);
    }

    /**
     * 
     * 执行渲染
     * 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(renderer, camera) {
        if (!this.#visible) {
            return;
        }

        // x 轴
        if (Math.abs(this.#y) > _axis_region || Math.abs(this.#z) > _axis_region) {
            if (this.#x_need_rebuild_geo) {
                this.#x_need_rebuild_geo = false;
                this.#line_segments_x.setSegments([
                    this.#x - _axis_length / 2.0,
                    0,
                    0,
                    this.#x + _axis_length / 2.0,
                    0,
                    0
                ]);
            }
            renderer.render(this.#line_segments_x, camera);
        }

        // y 轴
        if (Math.abs(this.#x) > _axis_region || Math.abs(this.#z) > _axis_region) {
            if (this.#y_need_rebuild_geo) {
                this.#y_need_rebuild_geo = false;
                this.#line_segments_y.setSegments([
                    0,
                    this.#y - _axis_length / 2.0,
                    0,
                    0,
                    this.#y + _axis_length / 2.0,
                    0
                ]);
            }
            renderer.render(this.#line_segments_y, camera);
        }

        // z 轴
        if (Math.abs(this.#x) > _axis_region || Math.abs(this.#y) > _axis_region) {
            if (this.#z_need_rebuild_geo) {
                this.#z_need_rebuild_geo = false;
                this.#line_segments_z.setSegments([
                    0,
                    0,
                    this.#z - _axis_length / 2.0,
                    0,
                    0,
                    this.#z + _axis_length / 2.0
                ]);
            }
            renderer.render(this.#line_segments_z, camera);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#line_segments_x.dispose();
        this.#line_segments_y.dispose();
        this.#line_segments_z.dispose();
    }
}
