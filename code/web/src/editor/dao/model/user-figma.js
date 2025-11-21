/* eslint-disable no-unused-vars */

import Figma from '@/embed/figma';

/**
 * Figma 用户
 */
class UserFigma {
    /**
     * 具体的数据
     */
    #id;
    #photo;
    #name;
    #color;

    /**
     * 获取
     */
    get ok() {
        return undefined !== this.#id
    }

    /**
     * 获取
     */
    get id() {
        return this.#id;
    }

    /**
     * 获取
     */
    get photo() {
        return this.#photo;
    }

    /**
     * 获取
     */
    get name() {
        return this.#name;
    }

    /**
     * 获取
     */
    get color() {
        return this.#color;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 尝试获取
     */
    async tryGet() {
        if (!window.isFigmaPlugin) {
            throw new Error("Env is not figma plugin!!!");
        }

        // 获取数据
        const result = await Figma.invoke('current-user');
        if (!result) {
            return false;
        }

        // 检测数据
        if (true !== result.success || !result.data) {
            return false;
        }

        // 分拆数据
        const data  = result.data;
        this.#id    = data.id;
        this.#photo = data.photo_url;
        this.#name  = data.data;
        this.#color = data.color;

        return true;
    }
}

export default new UserFigma();