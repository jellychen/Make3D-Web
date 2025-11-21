/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 
 * 用来代表整个场景中部分子树
 * 
 * 如果选中节点，那么索引的子节点都被选中
 * 
 */
export default class SubtreeRoots {
    /**
     * 根节点容器
     */
    #container = new Set();

    /**
     * 是否需要修剪
     */
    #need_trim = true;

    /**
     * 获取
     */
    get data() {
        this.trimIfNeed();
        return this.#container;
    }

    /**
     * 获取
     */
    get arr() {
        this.trimIfNeed();
        return [...this.#container];
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加
     * 
     * @param {*} object 
     * @returns 
     */
    add(object) {
        if (!object || this.#container.has(object)) {
            return false;
        }
        this.#container.add(object);
        this.#need_trim = true;
        return this;
    }

    /**
     * 
     * 移除
     * 
     * @param {*} object 
     * @returns 
     */
    delete(object) {
        this.#container.delete(object);
        return this;
    }

    /**
     * 
     * 标记需要修剪
     * 
     * @returns 
     */
    markNeedTrim() {
        this.#need_trim = true;
        return this;
    }

    /**
     * 
     * 获取数量
     * 
     * @returns 
     */
    size() {
        this.trimIfNeed();
        return this.#container.size;
    }

    /**
     * 
     * 判断是否存在里面
     * 
     * @param {*} object 
     * @returns 
     */
    in(object) {
        this.trimIfNeed();
        return this.#container.has(object);
    }

    /**
     * 
     * 判断是否在子树中
     * 
     * @param {*} object 
     * @returns 
     */
    containerOf(object) {
        this.trimIfNeed();

        let current = object;
        while (current) {
            if (this.#container.has(current)) {
                return true;
            } else {
                current = current.parent;
            }
        }
        return false;
    }

    /**
     * 
     * 如果需要修剪
     * 
     * @returns 
     */
    trimIfNeed() {
        if (this.#need_trim) {
            this.trim();
            this.#need_trim = false;
        }
        return this;
    }

    /**
     * 
     * 修剪
     * 
     * @returns 
     */
    trim() {
        for (const item of this.#container) {
            //
            // 先把已经不在场景中的元素移除
            //
            if (!item.isInScene()) {
                this.#container.delete(item);
                continue;
            }

            //
            // 如果元素的父亲也在里面
            //
            let parent = item.parent;
            while (true) {
                if (!parent) {
                    break;
                } else if (this.#container.has(parent)) {
                    this.#container.delete(item);
                    break;
                } else {
                    parent = parent.parent;
                }
            }
        }
        this.#need_trim = false;

        return this;
    }

    /**
     * 
     * 更新
     * 
     * @param {*} force 
     * @returns 
     */
    update(force = true) {
        if (force) {
            return this.trim();
        } else {
            return this.trimIfNeed();
        }
    }
}
