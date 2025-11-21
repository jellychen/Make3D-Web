/* eslint-disable no-unused-vars */

import { LRUCache } from 'lru-cache'

/**
 * Cache
 */
export default class LruCache {
    /**
     * 缓存
     */
    #cache;

    /**
     * 
     * 构造函数
     * 
     * @param {*} max_count 
     * @param {*} dispose_calback 
     * @param {*} ttl 
     */
    constructor(max_count = 1000, dispose_calback = (value, key) => {}) {
        this.#cache = new LRUCache({
            max    : max_count,
            dispose: dispose_calback,
        })
    }

    /**
     * 
     * 设置
     * 
     * @param {*} key 
     * @param {*} value 
     */
    set(key, value) {
        this.#cache.set(key, value);
    }

    /**
     * 
     * 获取
     * 
     * @param {*} key 
     * @returns 
     */
    get(key) {
        return this.#cache.get(key);
    }

    /**
     * 清理
     */
    clear() {
        this.#cache.clear();
    }
}
