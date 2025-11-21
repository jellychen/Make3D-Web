/* eslint-disable no-unused-vars */

import isBoolean     from "lodash/isBoolean";
import ShaderUniform from "../base";

/**
 * 真值
 */
export default class Boolean extends ShaderUniform {
    /**
     * 初始化值
     */
    #init_value = false;

    /**
     * 引用值
     */
    #data;

    /**
     * 获取
     */
    get type() {
        return 'boolean';
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} value 
     */
    constructor(value = false) {
        super();
        this.#init_value = !!value;
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
                    value: this.#init_value
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
        return `uniform bool ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     */
    setValue(value) {
        if (!isBoolean(value)) {
            throw new Error('value must boolean');
        }

        const name = this.name
        const data = this.valueDefine();
        if (data[name].value != value) {
            data[name].value  = value;
            this.markNeedsUpdate();
        }
    }

    /**
     * 
     * 克隆
     * 
     * @returns 
     */
    clone() {
        return new Boolean();
    }
}