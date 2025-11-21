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
        this.#uniform.color_front      =  tsl.uniform(tsl.color(0x747474));
        this.#uniform.color_back       =  tsl.uniform(tsl.color(0x484848));
        this.#uniform.opacity          =  tsl.uniform(tsl.float(1));
        this.#uniform.enhance          =  tsl.uniform(tsl.float(1));
        this.colorNode                 =  tsl.Fn(() => {
            const n0                   =  tsl.normalize(tsl.negate(tsl.positionView)).toVar();
            const normal               =  tsl.normalize(tsl.normalLocal).toVar();
            const c                    =  tsl.dot(normal, n0).toVar();
            const color                =  tsl.vec3(0, 0, 0).toVar();
            tsl.If(tsl.frontFacing, () => {
                color.assign(this.#uniform.color_front);
            }).Else(()                 => {
                color.assign(this.#uniform.color_back);
            });
            const factor               =  tsl.pow(tsl.abs(c), this.#uniform.enhance).toVar();
            factor.assign(tsl.smoothstep(0, 1.2, factor.add(0.2)));
            const opacity              =  this.#uniform.opacity;
            const out                  =  tsl.vec4(color.mul(factor).mul(opacity), opacity);
            return tsl.convertColorSpace(out, XThree.LinearSRGBColorSpace, XThree.SRGBColorSpace);
        })();
    }

    /**
     * 
     * 设置
     * 
     * @param {*} side 
     */
    setSide(side) {
        this.side = side;
    }

    /**
     * 
     * 设置半透明
     * 
     * @param {boolean} transparent 
     * @param {float} opacity 
     */
    setTransparent(transparent, opacity) {
        this.transparent = true === transparent;
        this.#uniform.opacity.value = parseFloat(opacity);
    }

    /**
     * 
     * 设置能量
     * 
     * @param {Number} enhance 
     */
    setEnhance(enhance) {
        this.#uniform.enhance.value = enhance;
    }

    /**
     * 
     * 设置正面颜色
     * 
     * @param {*} color 
     */
    setFrontColor(color) {
        this.#uniform.color_front.value.setHex(color);
    }

    /**
     * 
     * 设置背面的颜色
     * 
     * @param {*} color 
     */
    setBackColor(color) {
        this.#uniform.color_back.value.setHex(color);
    }
}
