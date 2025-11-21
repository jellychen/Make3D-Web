/* eslint-disable no-unused-vars */

import LocalFileUrlsContainer from './local-file-urls-container';

/**
 * 用来存储图片URL
 */
export default class LocalImageUrls {
    /**
     * 容器
     */
    #container = new LocalFileUrlsContainer();

    /**
     * 
     * 获取单例
     * 
     * @returns 
     */
    static Default() {
        if (!this._default_instance) {
            this._default_instance = new LocalImageUrls();
        }
        return this._default_instance;
    }

    /**
     * 
     * 加入容器
     * 
     * @param {string} url 
     * @returns 
     */
    add(url) {
        return this.#container.add(url) > 0;
    }

    /**
     * 
     * 移除
     * 
     * @param {*} url 
     * @returns 
     */
    remove(url) {
        if (0 == this.#container.remove(url)) {
            URL.revokeObjectURL(url);
        }
        return true;
    }
}
