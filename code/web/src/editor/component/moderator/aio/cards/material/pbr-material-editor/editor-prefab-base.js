/* eslint-disable no-unused-vars */

import Element   from '@ux/base/element';

/**
 * 预制基类
 */
export default class BizMaterialEditorPrefabBase extends Element {
    /**
     * 用来和编辑器通讯
     */
    #context = undefined;

    /**
     * 
     * 构造函数
     * 
     * @param {*} name 
     * @param {*} context 
     */
    constructor(name, context) {
        super(name);
        this.#context = context;
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 
     * 从指定的材质中拷贝参数
     * 
     * @param {*} material 
     */
    copyArgumentsFrom(material) {
        throw new Error("copyArgumentsFrom is not implement");
    }

    /**
     * 
     * 更新，如果材质外部数据变化
     * 
     * 通过调用这个函数来把材质的参数显示到界面上面
     * 
     */
    update() {
        
    }

    /**
     * 
     * 获取材质
     * 
     * @returns 
     */
    getMaterial() {
        throw new Error("getMaterial is not implement");
    }

    /**
     * 
     * 材质发生了变化
     * 
     * @param {*} material 
     * @param {*} has_textures_changed 
     */
    triggerChanged(material, has_textures_changed = false) {
        if (this.#context) {
            this.#context.triggerChanged(material, has_textures_changed);
        }
    }

    /**
     * 请求在下一帧进行重绘
     */
    requestRenderNextFrame() {
        if (this.#context) {
            this.#context.requestRenderNextFrame();
        }
    }
}
