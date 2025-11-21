/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import cloneDeep from 'lodash/cloneDeep';
import isString  from 'lodash/isString';

/**
 * 数据适配器
 */
export default class Adapter {
    /**
     * 数据
     */
    #data = [];

    /**
     * 
     * 构造函数
     * 
     * @param {*} data 
     * @param {*} deep_clone 
     */
    constructor(data = [], deep_clone = false) {
        this.setData(data, deep_clone);
    }

    /**
     * 
     * 存在数据
     * 
     * @returns 
     */
    hasData() {
        return this.#data && this.#data.length > 0;
    }

    /**
     * 
     * 设置数据
     * 
     * @param {Object} data 
     * @param {boolean} deep_clone 
     */
    setData(data = [], deep_clone = false) {
        data = data || [];
        if (deep_clone) {
            this.#data = cloneDeep(data);
        } else {
            this.#data = data;
        }
    }

    /**
     * 
     * 获取数据
     * 
     * @returns 
     */
    getData() {
        return this.#data;
    }

    /**
     * 获取数据长度
     */
    getCount() {
        if (this.#data) {
            return this.#data.length;
        }
        return 0;
    }

    /**
     * 
     * 获取指定index的数据
     * 
     * @param {Number} index 
     */
    getItem(index) {
        return this.#data[index];
    }

    /**
     * 
     * 通过 UUID, 找到Item的索引
     * 
     * @param {*} uuid 
     */
    getItemIndexByUUID(uuid) {
        if (!isString(uuid)) {
            return -1;
        }

        const length = this.#data.length;
        for (let i = 0; i < length; ++i) {
            if (uuid === this.#data[i].uuid) {
                return i;
            }
        }

        return -1;
    }

    /**
     * 
     * 获取指定的Index的元素
     * 
     * @param {Number} index 
     * @returns 
     */
    getIndexedElement(index) {
        index = parseInt(index);

        // 检测范围
        const data_length = this.#data.length;
        if (index >= data_length || index < 0) {
            return undefined;
        }

        // 获取元素
        return this.#data[index].object;
    }

    /**
     * 
     * 获取指定的Index的元素父亲的Index
     * 
     * @param {Number} index 
     * @returns 
     */
    getIndexedElementParentIndex(index) {
        index = parseInt(index);

        // 检测范围
        let data_length = this.#data.length;
        if (index >= data_length || index < 0) {
            return -1;
        }

        // 获取
        let depth = this.#data[index].depth;
        for (let i = index - 1; i >= 0; i--) {
            if (this.#data[i].depth < depth) {
                return i;
            }
        }

        return -1;
    }

    /**
     * 
     * 获取指定的Index的元素
     * 
     * @param {Number} index 
     * @returns 
     */
    getIndexedElementDepth(index) {
        index = parseInt(index);

        // 检测范围
        const data_length = this.#data.length;
        if (index >= data_length || index < 0) {
            return undefined;
        }

        // 获取元素
        return this.#data[index].depth;
    }

    /**
     * 
     * 设置折叠的状态
     * 
     * @param {Number} index 
     * @param {*} folded 
     */
    setIndexedElementFolded(index, folded) {
        index = parseInt(index);

        // 检测范围
        const data_length = this.#data.length;
        if (index >= data_length || index < 0) {
            return false;
        }

        // 设置
        this.#data[index].folded = true == folded;

        return true;
    }

    /**
     * 
     * index 指定的元素，的孩子全部干掉
     * 
     * @param {Number} index 
     */
    removeIndexedElementChildren(index) {
        index = parseInt(index);

        // 检测范围
        let data_length = this.#data.length;
        if (index >= data_length || index < 0) {
            return false;
        }

        // 获取深度
        let depth = this.#data[index].depth;
        let count = 0;
        for (let i = index + 1; i < data_length; ++i) {
            if (this.#data[i].depth > depth) {
                count++;
            } else {
                break;
            }
        }

        // 如果没有找到
        if (0 == count) {
            return false;
        }
        
        return this.removeRange(index + 1, count);
    }

    /**
     * 
     * 删除指定区域的元素
     * 
     * @param {Number} start 
     * @param {Number} count 
     */
    removeRange(start, count) {
        if (!this.#data || count <= 0 || start < 0) {
            return false;
        }

        if (start >= this.#data.length || start + count > this.#data.length) {
            return false;
        }
        
        this.#data.splice(start, count);

        return true;
    }

    /**
     * 
     * 把后一个Adapter插入到当前的指定为止
     * 
     * @param {Number} index 
     * @param {*} adapter 
     */
    insert(index, adapter, deep_clone = false) {
        index = parseInt(index);

        // 检测范围
        if (index < 0 || index >= this.#data.length) {
            return false;
        }

        // 可能需要
        let data = adapter.getData();
        if (!data || 0 == data.length) {
            return false;
        }

        if (true === deep_clone) {
            data = cloneDeep(data);
        }

        // 插入
        this.#data.splice(index + 1, 0, ...data);

        return true;
    }

    /**
     * 
     * 更新指定的元素的名称
     * 
     * @param {Number} index 
     * @param {String} name 
     */
    updateIndexedName(index, name) {
        index = parseInt(index);

        // 检测范围
        if (index < 0 || index >= this.#data.length) {
            return false;
        }

        // 更新
        this.#data[index].name = name;

        return true;
    }

    /**
     * 
     * 更新指定索引的数据, 从Threejs中同步过来
     * 
     * @param {*} index 
     * @returns 
     */
    updateIndexed(index) {
        index = parseInt(index);

        // 检测范围
        if (index < 0 || index >= this.#data.length) {
            return false;
        }

        // 获取元素
        const item = this.#data[index];
        const node = item.object;

        // 更新属性
        item.name      = node.getNameOrTypeAsName();
        item.uuid      = node.uuid;
        item.type      = node.type;
        item.has_child = node.isOverall()? false: node.hasChildren();
        item.folded    = node.isFolded();
        
        return true;
    }
}
