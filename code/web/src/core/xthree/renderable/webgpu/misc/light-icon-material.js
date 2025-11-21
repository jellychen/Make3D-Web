/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 灯光绘制材质
 */
export default class LightIconMaterial extends XThree.PointsNodeMaterial {
    /**
     * uniform
     */
    #u_color      = tsl.uniform(tsl.color(0xFFFFFF));
    #u_point_size = tsl.uniform(tsl.float(10));
    #u_r0         = tsl.uniform(tsl.float(4));
    #u_r1         = tsl.uniform(tsl.float(1));
    #u_gap        = tsl.uniform(tsl.float(2));

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.sizeAttenuation      = false;
        this.vertexColors         = false;
        this.size                 = 10;
        this.transparent          = true;
        this.colorNode            = tsl.Fn(() => {
            const half_point_size = this.#u_point_size.mul(0.5).toVar();
            const a               = tsl.float(0).toVar();
            const current_xy      = tsl.uv().mul(this.#u_point_size).toVar();

            // 原点
            const origin          = tsl.vec2(half_point_size, half_point_size).toVar();

            // 首先判断在不在大圆里面
            const d               = tsl.distance(current_xy, origin).toVar();
            a.assign(tsl.oneMinus(tsl.smoothstep(tsl.sub(this.#u_r0, 0.5), this.#u_r0, d))).toVar();

            // 然后判断在不在6个小圆里面
            tsl.Loop(8, ({ i })   => {
                const angle       = tsl.float(i).mul(6.28318530718 / 8.0).toVar(); // 2 * PI / 8
                const rr          = tsl.add(tsl.add(this.#u_r0, this.#u_r1), this.#u_gap).toVar();
                const center      = tsl.vec2(tsl.vec2(rr.mul(tsl.cos(angle)), rr.mul(tsl.sin(angle))).add(origin)).toVar();
                const d           = tsl.distance(current_xy, center);
                const current_a   = tsl.oneMinus(tsl.smoothstep(tsl.sub(this.#u_r1, 0.5), this.#u_r1, d)).toVar();
                a.assign(tsl.max(current_a, a));
            });

            return tsl.vec4(this.#u_color.mul(a), a);
        })();
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
     * 设置点的尺寸
     * 
     * @param {Number} size 
     */
    setPointSize(size) {
        size = parseFloat(size);
        this.size = size;
        this.#u_point_size.value = size;
    }

    /**
     * 
     * 设置大圆的尺寸
     * 
     * @param {*} r 
     */
    setR0(r) {
        this.#u_r0.value = parseFloat(r);
    }

    /**
     * 
     * 设置小圆的尺寸
     * 
     * @param {*} r 
     */
    setR1(r) {
        this.#u_r1.value = parseFloat(r);
    }

    /**
     * 
     * 设置距离
     * 
     * @param {*} gap 
     */
    setGap(gap) {
        this.#u_gap.value = parseFloat(gap);
    }
}
