/* eslint-disable no-unused-vars */

/**
 * 配置中心
 */
class Configure {
    /**
     * 数据
     */
    #arr = [];

    /**
     * 获取
     */
    get conf() {
        return this.#arr;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加
     * 
     * @param {*} element 
     * @param {*} desc_token 
     */
    add(element, desc_token) {
        if (element && desc_token) {
            this.#arr.push({
                element,
                desc: desc_token,
            });
        }
    }

    /**
     * 清理
     */
    clear() {
        this.#arr.length = 0;
    }
}

export default new Configure();
