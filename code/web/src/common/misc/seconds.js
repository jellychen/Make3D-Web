
/**
 * 秒转
 */
export default class Seconds {
    /**
     * 秒
     */
    #seconds = 0;

    /**
     * 获取
     */
    get seconds() {
        return this.#seconds;
    }

    /**
     * 小时
     */
    get h() {
        return Math.floor(this.#seconds / 3600);
    }

    /**
     * 分钟
     */
    get m() {
        return Math.floor((this.#seconds % 3600) / 60);
    }

    /**
     * 秒
     */
    get s() {
        return this.#seconds % 60;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 设置时间
     * 
     * @param {*} seconds 
     */
    set(seconds) {
        this.#seconds = parseInt(seconds);
    }

    /**
     * 
     * 转化到字符串
     * 
     * @returns 
     */
    toStr() {
        const h = this.h;
        const m = this.m;
        const s = this.s;

        let str;
        if (h > 0) str += `${h}-`;
        if (m > 0) str += `${m}-`;
        str += `${s}-`;

        return str;
    }
}
