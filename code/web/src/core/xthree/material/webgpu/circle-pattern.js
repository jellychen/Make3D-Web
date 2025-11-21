/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * uniform
     */
    #uniform = {};

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.#uniform.color = tsl.uniform(tsl.color(0xFFFFFF));
        this.#uniform.scale = tsl.uniform(tsl.float(20));

        const circle        = tsl.Fn(([_st, _radius]) => {
            const radius    = tsl.float(_radius).toVar();
            const st        = tsl.vec2(_st).toVar();
            const l         = tsl.vec2(st.sub(tsl.vec2(0.5, 0.5))).toVar();
            const range     = tsl.float(radius.mul(0.1)).toVar();
            const c         = tsl.dot(l, l).mul(4.0).toVar();
            const a         = radius.sub(range).toVar();
            const b         = radius.add(range).toVar();
            return tsl.sub(1, tsl.smoothstep(a, b, c))
        }).setLayout( {
            name            : 'circle',
            type            : 'float',
            inputs          : [
                { name      : '_st'    , type: 'vec2' , qualifier: 'in' },
                { name      : '_radius', type: 'float', qualifier: 'in' }
            ]
        } );;

        this.colorNode      = tsl.Fn(() => {
            const st        = tsl.uv().mul(this.#uniform.scale).toVar();
            const st_0      = tsl.fract(st).toVar();
            const d         = tsl.distance(tsl.positionGeometry, tsl.vec3(0)).toVar();
            const d_0       = tsl.sub(1, tsl.smoothstep(0.3, 0.95, d)).toVar();
            const v         = circle(st_0, 0.5).mul(0.3).mul(d_0).toVar();
            const out       = tsl.vec4(this.#uniform.color.mul(v), v);
            return tsl.convertColorSpace(out, XThree.LinearSRGBColorSpace, XThree.SRGBColorSpace);
        })();

        this.transparent = true;
        this.depthWrite  = false;
        this.depthTest   = false;
        this.side        = XThree.DoubleSide;
    }

    /**
     * 
     * 设置缩放值
     * 
     * @param {Number} scale 
     */
    setScale(scale) {
        this.#uniform.scale.value = scale;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     * @returns 
     */
    setColor(color) {
        this.#uniform.color.value.setHex(color);
    }
}
