/* eslint-disable no-unused-vars */

import isNumber      from "lodash/isNumber";
import ShaderUniform from "../base";

/**
 * 浮点数
 */
export default class Float extends ShaderUniform {
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
        return 'float';
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} value 
     */
    constructor(value = 0.0) {
        super();
        this.#init_value = parseFloat(value);
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
        return `uniform float ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     */
    setValue(value) {
        if (!isNumber(value)) {
            throw new Error('value must float');
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
        return new Float();
    }
}
