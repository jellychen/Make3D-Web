/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import XThreeRenderable from '@xthree/renderable';

/**
 * 定义常量
 */
const _segments  = 32;
const _radius    = 1;
const _width     = 1;
const _color_0_r = 1;
const _color_0_g = 0;
const _color_0_b = 0;
const _color_1_r = 1;
const _color_1_g = 1;
const _color_1_b = 1;

/**
 * 临时变量
 */
const _vec3_0    = new XThree.Vector3();
const _vec3_1    = new XThree.Vector3();
const _vec3_2    = new XThree.Vector3();
const _vec3_3    = new XThree.Vector3();
const _vec3_4    = new XThree.Vector3();
const _vec3_5    = new XThree.Vector3();
const _vec4      = new XThree.Vector4();
const _position  = new XThree.Vector3();
const _scale     = new XThree.Vector3();
const _mat_0     = new XThree.Matrix4();
const _mat_1     = new XThree.Matrix4();
const _quat_0    = new XThree.Quaternion();
const _quat_1    = new XThree.Quaternion();

/**
 * 网格
 */
export default class Mesh extends XThreeRenderable.LineSegmentsColor {
    /**
     * 半径
     */
    #radius = 1.0;

    /**
     * 
     * 构造函数
     * 
     * @param {*} slave 
     */
    constructor(slave = false) {
        super();
        
        this.material.depthWrite   = false;
        this.material.stencilWrite = false;

        // 颜色
        let c0_r = _color_0_r;
        let c0_g = _color_0_g;
        let c0_b = _color_0_b;
        let c1_r = _color_1_r;
        let c1_g = _color_1_g;
        let c1_b = _color_1_b;

        // 如果
        if (slave) {
            this.material.depthTest = true;
            c0_r = 1;
            c0_g = 1;
            c0_b = 1;
            c1_r = 1;
            c1_g = 1;
            c1_b = 1;
            this.setWidth(_width / 2.0);
        } else {
            this.material.depthTest = false;
            this.setWidth(_width);
        }

        // 几何数据
        const segments_points = [];
        const segments_colors = [];

        // 添加柄
        // 绘制边线
        {
            segments_points.push(
                0,
                0,
                0,
                0,
                0,
                _radius / 3,
            );

            segments_colors.push(
                c0_r,
                c0_g,
                c0_b,
                c0_r,
                c0_g,
                c0_b,
            );
        }

        // 绘制圆形
        const step = (2 * Math.PI) / _segments;
        for (let i = 0; i < _segments; ++i) {
            // 线段顶点
            const from = (i * step);
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
            if (i % 3 == 0) {
                segments_colors.push(
                    c0_r,
                    c0_g,
                    c0_b,
                    c0_r,
                    c0_g,
                    c0_b,
                );
            } else {
                segments_colors.push(
                    c1_r,
                    c1_g,
                    c1_b,
                    c1_r,
                    c1_g,
                    c1_b,
                );
            }
        }
        this.setSegments(segments_points, segments_colors);
    }

    /**
     * 
     * 设置半径
     * 
     * @param {*} radius 
     * @returns 
     */
    setRadius(radius) {
        this.#radius = radius;
        this.scale.set(this.#radius, this.#radius, this.#radius);
        return this;
    }

    /**
     * 
     * 设置位置信息
     * 
     * @param {XThree.Vector3} position  位置
     * @param {XThree.Vector3} z_dir     朝向
     * @returns
     */
    setPositionInfo(position, z_dir) {
        this.matrix.identity();
        _vec3_0.copy(z_dir).normalize();
        _vec3_1.x = 0;
        _vec3_1.y = 0;
        _vec3_1.z = 1;
        this.position.copy(position);
        this.quaternion.setFromUnitVectors(_vec3_1, _vec3_0);
        this.scale.set(this.#radius, this.#radius, this.#radius);
        return this;
    }

    /**
     * 
     * 位置 朝向 和 半径
     * 
     * @param {*} position 
     * @param {*} z_dir 
     * @param {*} radius 
     * @returns 
     */
    setPositionInfoAndRadius(position, z_dir, radius) {
        this.setRadius(radius);
        this.setPositionInfo(position, z_dir);
        return this;
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
