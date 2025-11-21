/* eslint-disable no-unused-vars */

import isNumber      from "lodash/isNumber";
import * as THREE    from "three";
import ShaderUniform from "../base";

/**
 * VEC4
 */
export default class Vec4 extends ShaderUniform {
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
        return 'vec4';
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @param {*} w 
     */
    constructor(x, y, z, w) {
        super();
        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);
        w = parseFloat(w);
        this.#init_value = new THREE.Vector4(x, y, z, w);
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
        return `uniform vec4 ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value  
     */
    setValue(value) {
        if (!(value instanceof THREE.Vector4)) {
            throw new Error('value must vec4');
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
     * @param {*} z 
     * @param {*} w 
     */
    setValue_XYZ(x, y, z, w) {
        if (!isNumber(x) || 
            !isNumber(y) || 
            !isNumber(z) || 
            !isNumber(w)) {
            throw new Error('value must float');
        }

        const name = this.name
        const data = this.valueDefine();
        data[name].value.set(x, y, z, w);
        this.markNeedsUpdate();
    }
}
