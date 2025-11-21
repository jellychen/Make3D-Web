/* eslint-disable no-unused-vars */

import isFunction    from "lodash/isFunction";
import * as THREE    from "three";
import ShaderUniform from "../base";

/**
 * 纹理
 */
export default class Texture extends ShaderUniform {
    /**
     * 引用值
     */
    #data;

    /**
     * 获取
     */
    get type() {
        return 'texture';
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 执行安装
     * 
     * @param {*} context 
     * @returns 
     */
    setup(context) {
        super.setup(context);
    }

    /**
     * 
     * 获取变量定义
     * 
     * @returns 
     */
    valueDefine() {
        if (!this.#data) {
            this.#data = {
                [this.name] : {
                    value: null
                },
            };
        }
        return this.#data;
    }

    /**
     * 
     * 生成定义代码
     * 
     * @returns 
     */
    emitGlslCode() {
        return `uniform sampler2D ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     */
    setValue(value) {
        if (!value || !(value instanceof THREE.Texture)) {
            throw new Error('value must texture or null');
        }
        const name = this.name
        const data = this.valueDefine();
        const text = data[name].value;

        //
        // 先增加引用计数
        //
        if (value && isFunction(value.__$$_add_ref__)) {
            value.__$$_add_ref__();
        }

        //
        // 旧
        //
        if (text && isFunction(text.__$$_del_ref__)) {
            text.__$$_del_ref__();
        }

        //
        // 更新
        //
        data[name].value = value;
        this.markNeedsUpdate();
    }

    /**
     * 
     * 克隆
     * 
     * @returns 
     */
    clone() {
        return new Texture();
    }

    /**
     * 销毁
     */
    dispose() {
        const name = this.name
        const data = this.valueDefine();
        const text = data[name].value;
        if (text && isFunction(text.__$$_del_ref__)) {
            text.__$$_del_ref__();
        }
        data[name].value = null;
    }
}
