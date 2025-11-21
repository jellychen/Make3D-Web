/* eslint-disable no-unused-vars */

import ShaderUniform from "../shader-uniform";

/**
 * 层基础
 */
export default class LayerEffectBase {
    /**
     * 是否可用
     */
    enable = true;
    
    /**
     * alpha
     */
    alpha = new ShaderUniform.Float(1);

    /**
     * 获取
     */
    get isEffect() {
        return true;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 设置透明度
     * 
     * @param {*} alpha 
     */
    setAlpha(alpha) {
        this.alpha.setValue(parseFloat(alpha));
    }

    /**
     * 
     * 准备
     * 
     * @param {*} requirement 
     */
    prepare(requirement) {
        ;
    }

    /**
     * 获取 宏定义
     */
    defines()   {}

    /**
     * 获取顶点着色器
     */
    vs_prev()   {}

    /**
     * 获取顶点着色器
     */
    vs()        {}

    /**
     * 获取片元着色器
     */
    fs_prev()   {}

    /**
     * 获取片元着色器
     */
    fs()        {}

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}
