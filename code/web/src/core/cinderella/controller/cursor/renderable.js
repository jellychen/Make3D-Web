/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 定义常量
 */
const _segments    = 12 ;
const _radius      = 0.8;
const _axis_len    = 0.6;
const _axis_offset = 0.5;
const _width       = 1;
const _color_0_r   = 1;
const _color_0_g   = 1;
const _color_0_b   = 1;
const _color_1_r   = 1;
const _color_1_g   = 0;
const _color_1_b   = 0;

/**
 * 游标的网格
 */
export default class Renderable extends XThreeRenderable.LineSegmentsColor {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.setWidth(_width);

        // 不做深度剔除,不做背面剔除
        this.material.depthTest = false;
        this.material.side      = XThree.DoubleSide;

        // 几何数据
        const segments_points   = [];
        const segments_colors   = [];

        // 绘制边线
        {
            segments_points.push(
                -_axis_offset,
                0,
                0,
                -_axis_offset - _axis_len,
                0,
                0,
            );

            segments_colors.push(
                _color_0_r,
                _color_0_g,
                _color_0_b,
                _color_0_r,
                _color_0_g,
                _color_0_b,
            );
        }

        {
            segments_points.push(
                +_axis_offset,
                0,
                0,
                +_axis_offset + _axis_len,
                0,
                0,
            );

            segments_colors.push(
                _color_0_r,
                _color_0_g,
                _color_0_b,
                _color_0_r,
                _color_0_g,
                _color_0_b,
            );
        }

        {
            segments_points.push(
                0,
                -_axis_offset,
                0,
                0,
                -_axis_offset - _axis_len,
                0,
            );

            segments_colors.push(
                _color_0_r,
                _color_0_g,
                _color_0_b,
                _color_0_r,
                _color_0_g,
                _color_0_b,
            );
        }

        {
            segments_points.push(
                0,
                +_axis_offset,
                0,
                0,
                +_axis_offset + _axis_len,
                0,
            );

            segments_colors.push(
                _color_0_r,
                _color_0_g,
                _color_0_b,
                _color_0_r,
                _color_0_g,
                _color_0_b,
            );
        }

        // 绘制圆形
        const step = (2 * Math.PI) / _segments;
        for (let i = 0; i < _segments; ++i) {
            // 线段顶点
            const from = i * step;
            const to   = (i + 1) % _segments * step;
            segments_points.push(
                _radius * Math.cos(from),
                _radius * Math.sin(from),
                0,
                _radius * Math.cos(to),
                _radius * Math.sin(to),
                0,
            );

            // 颜色
            if (i % 2 == 1) {
                segments_colors.push(
                    _color_0_r,
                    _color_0_g,
                    _color_0_b,
                    _color_0_r,
                    _color_0_g,
                    _color_0_b,
                );
            } else {
                segments_colors.push(
                    _color_1_r,
                    _color_1_g,
                    _color_1_b,
                    _color_1_r,
                    _color_1_g,
                    _color_1_b,
                );
            }
        }
        this.setSegments(segments_points, segments_colors);
    }

    /**
     * 
     * 设置分辨率
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    setResolution(width, height) {
        super.setResolution(width, height);
    }
}
