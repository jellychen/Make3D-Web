/* eslint-disable no-unused-vars */

import isNumber      from "lodash/isNumber";
import * as THREE    from "three";
import ShaderUniform from "../base";

/**
 * VEC2
 */
export default class Vec2 extends ShaderUniform {
    /**
     * 初始化值
     */
    #init_value;

    /**
     * 引用值
     */
    #data;

    /**
     * 获取
     */
    get type() {
        return 'vec2';
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} x 
     * @param {*} y 
     */
    constructor(x, y) {
        super();
        x = parseFloat(x);
        y = parseFloat(y);
        this.#init_value = new THREE.Vector2(x, y);
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
        return `uniform vec2 ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value  
     */
    setValue(value) {
        if (!(value instanceof THREE.Vector2)) {
            throw new Error('value must vec2');
        }

        const name = this.name
        const data = this.valueDefine();
        data[name].value.copy(value);
        this.markNeedsUpdate();
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} x 
     * @param {*} y 
     */
    setValue_XY(x, y) {
        if (!isNumber(x) || !isNumber(y)) {
            throw new Error('value must float');
        }

        const name = this.name
        const data = this.valueDefine();
        data[name].value.set(x, y);
        this.markNeedsUpdate();
    }
}
