/* eslint-disable no-unused-vars */

import isString  from 'lodash/isString';
import isInteger from 'lodash/isInteger';
import Fuse      from 'fuse.js'

/**
 * 配置
 */
const __searcher_conf__ = {
    keys: ["name"],             // 定义要搜索的属性
    isCaseSensitive:    false,  // 大小写
    includeScore:       true,   // 是否包含搜索得分
    shouldSort:         true,   // 根据分数排序结果
};

/**
 * 
 * 搜索
 * 
 * https://www.fusejs.io/
 * 
 */
export default class IndexSearcher {
    /**
     * 搜索引擎
     */
    #data = undefined;
    #searcher = new Fuse([], __searcher_conf__);

    /**
     * 构造函数
     */
    constructor() {}

    /**
     * 开始构建
     */
    beginBuild() {
        this.#data = [];
    }

    /**
     * 
     * 添加数据
     * 
     * @param {*} type 
     * @param {*} name 
     * @param {*} user_data 
     */
    add(type, name, user_data = undefined) {
        this.#data.push({
            type,
            name,
            user_data,
        });
    }

    /**
     * 
     * 设置数据
     * 
     * @param {Array} data 
     */
    setCollection(data) {
        this.#searcher.setCollection(data || []);
    }

    /**
     * 提交数据构建索引
     */
    commit() {
        this.setCollection(this.#data);
    }

    /**
     * 
     * 搜索
     * 
     * @param {String} key 
     * @param {Number} limit 
     * @returns 
     */
    search(key, limit = 8) {
        if (!isString(key)) {
            return undefined;
        }

        if (!isInteger(limit)) {
            limit = 8;
        }
        
        return this.#searcher.search(key, {limit: limit});
    }
}
