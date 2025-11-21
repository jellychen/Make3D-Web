
import isNumber   from "lodash/isNumber";
import isFunction from "lodash/isFunction";
import Group      from "./recorder-group";

/**
 * 最大记录
 */
const MAX_RECORDER_SIZE = 128;

/**
 * 用来记录
 */
export default class HistoricalRecorder {
    /**
     * 用来结论数据
     */
    #arr = [];
    
    /**
     * 最大记录
     */
    #max_recorder_size = MAX_RECORDER_SIZE;

    /**
     * 当前用来合并多个操作的池子
     */
    #current_group;

    /**
     * 设置hooker
     */
    #hooker;

    /**
     * 禁止回滚
     */
    #disbale_rollback = false;

    /**
     * 禁止回滚
     */
    get disbale_rollback() {
        return this.#disbale_rollback;
    }

    /**
     * 是否
     */
    set disbale_rollback(value) {
        this.#disbale_rollback = !!value;
    }

    /**
     * 钩子
     */
    get hooker() {
        return this.#hooker;
    }

    /**
     * 钩子
     */
    set hooker(hooker) {
        this.#hooker = hooker;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} size 
     */
    constructor(size = MAX_RECORDER_SIZE) {
        if (isNumber(size)) {
            this.#max_recorder_size = size;
        }
    }

    /**
     * 
     * 是否为空
     * 
     * @returns 
     */
    empty() {
        return 0 == this.#arr.length;
    }

    /**
     * 
     * 获取尺寸
     * 
     * @returns 
     */
    size() {
        return this.#arr.length;
    }

    /**
     * 
     * 是否可以回滚
     * 
     * @returns 
     */
    canRollback() {
        return this.#arr.length > 0;
    }

    /**
     * 开启合并后续的操作
     */
    beginGroup() {
        if (this.#current_group) {
            throw new Error("current_group");
        } else {
            this.#current_group = new Group();
        }
    }

    /**
     * 
     * 添加
     * 
     * @param {*} item 
     */
    append(item) {
        if (this.#current_group) {
            this.#current_group.push(item);
            return;
        }

        if (this.#arr.length >= this.#max_recorder_size) {
            const front = this.#arr.shift();
            if (isFunction(front.destroy)) {
                front.destroy();
            }
        }
        this.#arr.push(item);
    }

    /**
     * 结束
     */
    endGroup() {
        if (this.#current_group) {
            const group = this.#current_group;
            this.#current_group = undefined;
            this.append(group);
        }
    }

    /**
     * 销毁最新的一次操作
     */
    dismissLastest() {
        if (this.#arr.length > 0) {
            const current = this.#arr.pop();
            if (isFunction(current.destroy)) {
                current.destroy();
            }
        }
    }

    /**
     * 回滚
     */
    rollback() {
        if (this.#hooker && isFunction(this.#hooker.rollback)) {
            return this.#hooker.rollback();
        }

        if (this.#disbale_rollback) {
            return false;
        }

        if (this.#arr.length == 0) {
            return false;
        }

        const current = this.#arr.pop();
        if (current) {
            if (isFunction(current.rollback)) {
                try {
                    current.rollback();
                } catch(e) {
                    console.error(e);
                }
            }
        }
        return true;
    }

    /**
     * 
     * 销毁部分
     * 
     * @param {*} size 
     * @returns 
     */
    distoryUtilSize(size) {
        if (this.#arr.length <= size) {
            return false;
        }

        while (this.#arr.length > size) {
            const current = this.#arr.pop();
            if (isFunction(current.destroy)) {
                try {
                    current.destroy();
                } catch(e) {
                    console.error(e);
                }
            }
        }
        return true;
    }

    /**
     * 销毁
     */
    distory() {
        for (const item of this.#arr) {
            if (isFunction(item.destroy)) {
                try {
                    item.destroy();
                } catch(e) {
                    console.error(e);
                }
            }
        }
        this.#arr = [];
    }
}
