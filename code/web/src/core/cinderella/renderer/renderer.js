/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree        from '@xthree/basic';
import LightRegister from '../core/light/register';

/**
 * 渲染器封装
 */
export default class Renderer extends XThree.Renderer {
    /**
     * 
     * 构造函数
     * 
     * @param {*} attr 
     */
    constructor(attr) {
        super(attr);

        //
        // 这里的 enabled 参数不要设置
        //
        // 通过设置下面
        //      scene.forbidden_shadow
        //
        this.shadowMap.enabled = true;
        this.shadowMap.type    = XThree.PCFSoftShadowMap;
        this.outputColorSpace  = XThree.SRGBColorSpace;

        //
        // WebGPU 必须先注册
        //
        LightRegister.Add(this);
    }

    /**
     * 设置SRGB颜色空间
     */
    setColorSpace_SRGB() {
        this.outputColorSpace = XThree.SRGBColorSpace;
    }

    /**
     * 设置线性颜色空间
     */
    setColorSpace_LINEAR() {
        this.outputColorSpace = XThree.LinearSRGBColorSpace;
    }

    /**
     * 
     * 设置阴影类型
     * 
     * XThree.BasicShadowMap
     * XThree.PCFShadowMap
     * XThree.PCFSoftShadowMap
     * XThree.VSMShadowMap
     * 
     * @param {ShadowMapType} type 
     */
    setShadowType(type) {
        this.shadowMap.type = type;
    }
}
