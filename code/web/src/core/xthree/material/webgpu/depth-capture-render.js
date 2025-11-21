/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.colorNode     = tsl.vec4(1);
        this.side          = XThree.DoubleSide;
        this.depthTest     = true;
        this.depthWrite    = true;
        this.polygonOffset = true;
    }

    /**
     * 
     * 设置渲染偏移
     * 
     * @param {*} factor 
     * @param {*} units 
     */
    setPolygonOffset(factor, units) {
        this.polygonOffsetFactor = factor;
        this.polygonOffsetUnits  = units ;
    }
}
