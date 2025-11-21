/* eslint-disable no-unused-vars */

import isFunction from "lodash/isFunction";

/**
 * 适配器容器
 */
export default class Container {
    /**
     * 适配器池子
     */
    #adapters = [];

    /**
     * host
     */
    #host;

    /**
     * 获取宿主
     */
    get host() {
        return this.#host;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} object_3d 
     */
    constructor(object_3d) {
        this.#host = object_3d;
    }

    /**
     * 
     * 是否存在
     * 
     * @param {*} adapter 
     * @returns 
     */
    has(adapter) {
        return -1 != this.#adapters.indexOf(adapter);
    }

    /**
     * 
     * 添加
     * 
     * @param {*} adapter 
     * @returns 
     */
    add(adapter) {
        if (!adapter) {
            return;
        } else if (!this.has(adapter)) {
            if (isFunction(adapter.attach)) {
                try {
                    adapter.attach(this.#host);
                } catch (e) {
                    console.error(e);
                }
            }
            this.#adapters.push(adapter);
        }
    }

    /**
     * 
     * 添加
     * 
     * @param {*} adapter 
     * @returns 
     */
    attach(adapter) {
        return this.add(adapter);
    }

    /**
     * 
     * 移除
     * 
     * @param {*} adapter 
     */
    del(adapter) {
        const index = this.#adapters.indexOf(adapter);
        if (index < 0) {
            return;
        }

        if (isFunction(adapter.detatch)) {
            try {
                adapter.detatch();
            } catch (e) {
                console.error(e);
            }
        }
        this.#adapters.splice(index, 1);
    }

    /**
     * 
     * 移除
     * 
     * @param {*} adapter 
     * @returns 
     */
    detach(adapter) {
        return this.del(adapter);
    }

    /**
     * 清理
     */
    clear() {
        for (const adapter of this.#adapters) {
            if (isFunction(adapter.detatch)) {
                try {
                    adapter.detatch();
                } catch (e) {
                    console.error(e);
                }
            }
        }
        this.#adapters.length = 0;
    }

    /**
     * 
     * 接收事件
     * 
     * @param {*} event 
     */
    onEvent(event) {
        for (const adapter of this.#adapters) {
            if (isFunction(adapter.onEvent)) {
                try {
                    adapter.onEvent(event);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}
