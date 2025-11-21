/* eslint-disable no-unused-vars */

/**
 * 唯一的id
 */
let uid = 0;

/**
 * 
 * 代表一个节点的一个槽
 * 
 * node + slot
 */
export default class Port {
    /**
     * 参数
     */
    #node;
    #slot;

    /**
     * uid
     */
    #uid;

    /**
     * 获取
     */
    get node() {
        return this.#node;
    }

    /**
     * 获取
     */
    get slot() {
        return this.#slot;
    }

    /**
     * 获取
     */
    get uid() {
        return this.#uid;
    }

    /**
     * 
     * 获取
     * 
     * @param {*} node 
     * @param {*} slot 
     */
    constructor(node, slot) {
        this.#node = node;
        this.#slot = slot;
        this.#uid  = uid++;
    }

    /**
     * 
     * 判断相等
     * 
     * @param {*} node 
     * @param {*} slot 
     * @returns 
     */
    equal(node, slot) {
        if (node instanceof Port) {
            if (node == this) {
                return true;
            } else {
                return this.#node == node.node &&
                       this.#slot == node.slot;
            }
        } else {
            return this.#node == node && this.#slot == slot;
        }
    }
}
