/* eslint-disable no-unused-vars */

import isNumber      from "lodash/isNumber";
import * as THREE    from "three";
import ShaderUniform from "../base";

/**
 * VEC3
 */
export default class Vec3 extends ShaderUniform {
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
        return 'vec3';
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    constructor(x, y, z) {
        super();
        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);
        this.#init_value = new THREE.Vector3(x, y, z);
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
        return `uniform vec3 ${this.name};`;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value  
     */
    setValue(value) {
        if (!(value instanceof THREE.Vector3)) {
            throw new Error('value must vec3');
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
     */
    setValue_XYZ(x, y, z) {
        if (!isNumber(x) || !isNumber(y) || !isNumber(z)) {
            throw new Error('value must float');
        }

        const name = this.name
        const data = this.valueDefine();
        data[name].value.set(x, y, z);
        this.markNeedsUpdate();
    }
}
