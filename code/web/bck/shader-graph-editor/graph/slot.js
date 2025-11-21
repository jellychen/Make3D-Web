/* eslint-disable no-unused-vars */

import Port from './port';

/**
 * 输入槽点
 */
export default class Slot {
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
     * 获取
     */
    #name;

    /**
     * 上游
     */
    #port;

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
    get port() {
        return this.#port;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} node 
     * @param {*} name 
     * @param {*} panel dom 元素
     */
    constructor(node, name, panel) {
        this.#node  = node;
        this.#name  = name;
        this.#panel = panel;
    }

    /**
     * 
     * 获取Html中元素
     * 
     * @returns 
     */
    getPanelPort() {
        if (!this.#panel_port) {
            this.#panel_port = this.#panel.getInPortByName(this.#name);
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
     * 设置上游节点
     * 
     * @param {*} port 
     */
    setFrom(port) {
        this.#port = port;
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
