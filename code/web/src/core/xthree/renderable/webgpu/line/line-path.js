/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 用来收集线段, 每2个点构建一个线段
 */
export default class LinePath {
    /**
     * 存放线段的点，每3个数字一个点
     */
    #data = [];

    /**
     * 启动点
     */
    #x = 0;
    #y = 0;
    #z = 0;

    /**
     * 上一个点
     */
    #last_x;
    #last_y;
    #last_z;

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 获取内部数据
     */
    get data() {
        return this.#data;
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.#data.length > 0;
    }

    /**
     * 清空
     */
    clear() {
        this.#data.length = 0;
        return this;
    }

    /**
     * 
     * 移动到下一个点
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    moveTo(x, y, z) {
        this.#x = x;
        this.#y = y;
        this.#z = z;

        this.#last_x = x;
        this.#last_y = y;
        this.#last_z = z;

        return this;
    }

    /**
     * 
     * 构成一条线段
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    lineTo(x, y, z) {
        this.#data.push(this.#last_x, this.#last_y, this.#last_z);
        this.#data.push(x           , y           , z           );
        this.#last_x = x;
        this.#last_y = y;
        this.#last_z = z;

        return this;
    }

    /**
     * 封闭
     */
    close() {
        if (this.#data.length < 9) {
            return false;
        }

        this.#data.push(this.#last_x, this.#last_y, this.#last_z);
        this.#data.push(this.#x     , this.#y     , this.#z     );
        
        return true;
    }
}
