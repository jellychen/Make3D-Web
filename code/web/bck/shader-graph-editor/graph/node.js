/* eslint-disable no-unused-vars */

import isArray    from "lodash/isArray";
import Slot       from "./slot";
import SlotOutlet from "./slot-outlet";

/**
 * 节点
 */
export default class Node {
    /**
     * html dom node
     */
    #dom_node;

    /**
     * 唯一id
     */
    #uuid;

    /**
     * 输入输出节点
     */
    #i = [];
    #o = [];

    /**
     * 获取
     */
    get dom_node() {
        return this.#dom_node;
    }

    /**
     * 获取名称
     */
    get uuid() {
        return this.#uuid;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} dom_node 
     * @param {String} uuid 
     * @param {Array<String>} arr_i 
     * @param {Array<String>} arr_o 
     */
    constructor(dom_node, uuid, arr_i, arr_o) {
        this.#dom_node = dom_node;
        this.#uuid = uuid;
        
        // 初始化输入槽
        if (isArray(arr_i)) {
            for (const k of arr_i) {
                this.#i.push(new Slot(this, k, this.#dom_node));
            }
        }

        // 初始化输出槽
        if (isArray(arr_o)) {
            for (const k of arr_o) {
                this.#o.push(new SlotOutlet(this, k, this.#dom_node));
            }
        }
    }

    /**
     * 
     * 获取输入槽
     * 
     * @param {*} name 
     * @returns 
     */
    getSlotIn(name) {
        for (const s of this.#i) {
            if (s.name == name) {
                return s;
            }
        }
        return;
    }

    /**
     * 
     * 获取输出槽
     * 
     * @param {*} name 
     * @returns 
     */
    getSlotOut(name) {
        for (const s of this.#o) {
            if (s.name == name) {
                return s;
            }
        }
        return;
    }

    /**
     * 
     * 遍历输入
     * 
     * @param {*} callback 
     */
    foreachAllSlotIn(callback) {
        for (const s of this.#i) {
            callback(s);
        }
    }

    /**
     * 
     * 遍历输出
     * 
     * @param {*} callback 
     */
    foreachAllSlotOut(callback) {
        for (const s of this.#o) {
            callback(s);
        }
    }

    /**
     * 位置发生了变化
     */
    updateLocation() {
        for (const s of this.#i) {
            s.updateLocation();
        }

        for (const s of this.#o) {
            s.updateLocation();
        }
    }
}