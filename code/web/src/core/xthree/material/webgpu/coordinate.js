/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * uniform
     */
    #u_max_distance;
    #u_point;
    #u_size_1;
    #u_size_2;
    #u_color;
    #u_color_x;
    #u_color_y;
    #u_scale;

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.#u_max_distance = tsl.uniform(tsl.float(10000));
        this.#u_point        = tsl.uniform(tsl.vec2(0));
        this.#u_size_1       = tsl.uniform(tsl.float(1));
        this.#u_size_2       = tsl.uniform(tsl.float(5));
        this.#u_color        = tsl.uniform(tsl.color(0x686868));
        this.#u_color_x      = tsl.uniform(tsl.color(0xEF362E));
        this.#u_color_y      = tsl.uniform(tsl.color(0x1eCE6E));
        this.#u_scale        = tsl.uniform(tsl.float(1));
        this.#u_point        = tsl.uniform(tsl.vec2(0, 0));

        this.positionNode    = tsl.Fn(() => {
            const xy         = tsl.positionLocal.xy.toVar();
            xy.assign(xy.mul(this.#u_max_distance));
            xy.assign(xy.add(this.#u_point));
            return tsl.vec3(xy, tsl.positionLocal.z);
        })();

        const GRID           = tsl.Fn(([size_immutable]) => {
            const size       = tsl.float(size_immutable).toVar();
            const r          = tsl.vec2(tsl.positionWorld.xy.div(size)).toVar();
            const t          = tsl.vec2(tsl.fwidth(r)).toVar();
            const grid       = tsl.vec2(tsl.abs(tsl.fract(r.sub(0.5)).sub(0.5)).div(t.mul(this.#u_scale))).toVar();
            return tsl.sub(1.0, tsl.min(tsl.min(grid.x, grid.y), 1.0));
        });

        const GRID_X         = tsl.Fn(() => {
            const r          = tsl.float(tsl.positionWorld.y).toVar();
            const grid       = tsl.float(tsl.abs(r).div(tsl.fwidth(r).mul(this.#u_scale))).toVar();
            return tsl.sub(1.0, tsl.min(grid, 1.0));
        });

        const GRID_Y         = tsl.Fn(() => {
            const r          = tsl.float(tsl.positionWorld.x).toVar();
            const grid       = tsl.float(tsl.abs(r).div(tsl.fwidth(r).mul(this.#u_scale))).toVar();
            return tsl.sub(1.0, tsl.min(grid, 1.0));
        });

        this.colorNode       = tsl.Fn(() => {
            const camera_dir = tsl.normalize(tsl.sub(tsl.positionWorld, tsl.cameraPosition)).toVar();
            const normal     = tsl.vec3(0, 0, 1).toVar();
            const c          = tsl.abs(tsl.dot(camera_dir, normal)).toVar();
            const alpha      = tsl.pow(tsl.smoothstep(0.0, 0.1, c), 2.0).mul(0.3).toVar();
            const d          = tsl.float(tsl.sub(1.0, tsl.min(tsl.distance(this.#u_point, tsl.positionWorld.xy).div(this.#u_max_distance), 1.0))).toVar();
            const g1         = GRID(this.#u_size_1);
            const g2         = GRID(this.#u_size_2);
            const gx         = GRID_X();
            const gy         = GRID_Y();
            const pd         = tsl.pow(d, 8.0).toVar();
            const color_0    = tsl.vec4(this.#u_color.rgb, tsl.mix(g2, g1, g1).mul(pd)).toVar();
            color_0.a.assign(tsl.mix(tsl.mul(0.5, color_0.a), color_0.a, g2));
            const cx         = tsl.vec4(tsl.mix(tsl.vec4(tsl.int(0)), tsl.vec4(this.#u_color_x, pd), gx)).toVar();
            const cy         = tsl.vec4(tsl.mix(tsl.vec4(tsl.int(0)), tsl.vec4(this.#u_color_y, pd), gy)).toVar();
            color_0.assign(tsl.max(cx, tsl.max(cy, color_0)));
            color_0.a.mulAssign(alpha);
            return color_0;
        })();

        this.transparent = true;
        this.depthWrite  = false;
        this.depthTest   = true;
        this.side        = XThree.DoubleSide;
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#u_color.value.setHex(color);
    }

    /**
     * 
     * 设置X轴显示的颜色
     * 
     * @param {*} color 
     */
    setXCoordColor(color) {
        this.#u_color_x.value.setHex(color);
    }

    /**
     * 
     * 设置y轴显示的颜色
     * 
     * @param {*} color 
     */
    setYCoordColor(color) {
        this.#u_color_y.value.setHex(color);
    }

    /**
     * 
     * 设置显示的最大距离
     * 
     * @param {*} distance 
     */
    setDistance(distance) {
        this.#u_max_distance.value = parseFloat(distance);
    }

    /**
     * 
     * 用来控制线宽
     * 
     * @param {Number} scale 
     */
    setScale(scale) {
        this.#u_scale.value = Math.clamp(scale, 1, 1.5);
    }

    /**
     * 
     * 设置相对的点
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    setPoint(x, y) {
        this.#u_point.value.set(x, y);
    }
}
