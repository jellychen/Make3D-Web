/* eslint-disable no-unused-vars */

import Port from './port';

/**
 * 输出槽点
 */
export default class SlotOutlet {
    /**
     * node
     */
    #node;
    #self_as_port;

    /**
     * html 元素
     */
    #panel;
    #panel_port;

    /**
     * 名称
     */
    #name;

    /**
     * 数据
     */
    #arr = [];

    /**
     * 位置
     */
    #location;

    /**
     * 获取
     */
    get name() {
        return this.#name;
    }

    /**
     * 获取
     */
    get arr() {
        return this.#arr;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} node 
     * @param {*} name 
     * @param {*} panel 
     */
    constructor(node, name, panel) {
        this.#node  = node;
        this.#name  = name;
        this.#panel = panel;
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.#arr.length > 0;
    }

    /**
     * 清理
     */
    clear() {
        this.#arr.length = 0;
    }

    /**
     * 
     * 获取Html中元素
     * 
     * @returns 
     */
    getPanelPort() {
        if (!this.#panel_port) {
            this.#panel_port = this.#panel.getOutPortByName(this.#name);
        }
        return this.#panel_port;
    }

    /**
     * 
     * 获取Html中元素 Dot 位置
     * 
     * @returns 
     */
    getPanelPortDotLocation() {
        if (!this.#location) {
            this.#location = this.getPanelPort().getDotLocation();
        }
        return this.#location;
    }

    /**
     * 
     * 判断存不存在
     * 
     * @param {*} port 
     * @returns 
     */
    has(port) {
        for (const item of this.#arr) {
            if (item.equal(port)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * 添加
     * 
     * @param {*} port 
     * @returns 
     */
    add(port) {
        if (this.has(port)) {
            return false;
        } else {
            this.#arr.push(port);
            return true;
        }
    }

    /**
     * 
     * 移除
     * 
     * @param {*} port 
     * @returns 
     */
    del(port) {
        let index = -1;
        for (let i = 0; i < this.#arr.length; ++i) {
            if (this.#arr[i].equal(port)) {
                index = i;
                break;
            }
        }

        if (index < 0) {
            return false;
        } else {
            this.#arr.splice(index, 1);
            return true;
        }
    }

    /**
     * 位置发生了变化
     */
    updateLocation() {
        this.#location = undefined;
    }

    /**
     * 
     * 转化成Port
     * 
     * @returns 
     */
    asPort() {
        if (!this.#self_as_port) {
            this.#self_as_port = new Port(this.#node, this);
        }
        return this.#self_as_port;
    }
}
