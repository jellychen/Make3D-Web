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
        const color               = tsl.uniform(tsl.color(0xFFFFFF));
        const range_solid         = tsl.uniform(tsl.float(1.0));
        const range_end           = tsl.uniform(tsl.float(2.0));
        this.#uniform.color       = color;
        this.#uniform.range_solid = range_solid;
        this.#uniform.range_end   = range_end;
        this.colorNode            = tsl.Fn(() => {
            const len             = tsl.length(tsl.positionGeometry).toVar();
            const l0              = tsl.smoothstep(range_solid, range_end, len).toVar();
            const alpha           = tsl.oneMinus(l0).toVar();
            const new_color       = color.mul(alpha);
            return tsl.vec4(new_color, alpha).toVar();
        })();
        this.transparent          = true;
        this.polygonOffset        = true;
        this.polygonOffsetUnits   = -1;
    }

    /**
     * 
     * 设置范围
     * 
     * @param {Number} solid 
     * @param {Number} end 
     */
    setRange(solid, end) {
        this.#uniform.range_solid.value = solid;
        this.#uniform.range_end.value   = end;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#uniform.color.value.setHex(color);
    }
}
