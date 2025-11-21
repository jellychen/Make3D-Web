/* eslint-disable no-unused-vars */

/**
 * 用来封装一个uniform
 */
export default class ShaderUniform {
    /**
     * 所属的shader
     */
    #shader;

    /**
     * 变量
     */
    #id = 0;

    /**
     * 获取
     */
    get isShaderUniform() {
        return true;
    }

    /**
     * 获取
     */
    get shader() {
        return this.#shader;
    }

    /**
     * 获取
     */
    get id() {
        return this.#id;
    }

    /**
     * 获取变量名
     */
    get name() {
        return `m3v_${this.#id}`;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 执行安装
     * 
     * @param {*} context 
     * @returns 
     */
    setup(context) {
        this.#shader = context.shader;
        this.#id     = context.genId();
        return true;
    }

    /**
     * 获取定义
     */
    valueDefine()  {}

    /**
     * 生成代码
     */
    emitGlslCode() {}

    /**
     * 克隆
     */
    clone()        {}

    /**
     * 销毁
     */
    dispose()      {}

    /**
     * 标记shader需要更新
     */
    markNeedsUpdate() {
        if (this.#shader) {
            this.#shader.needsUpdate = true;
        }
    }
}
