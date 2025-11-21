/* eslint-disable no-unused-vars */

import JSZIP from 'jszip';

/**
 * m3d 文件加载器
 */
export default class Loader {
    /**
     * 解压缩
     */
    #jszip;
    #jszip_loaded;

    /**
     * 实际内容
     */
    #content_buffer;

    /**
     * 构造函数
     */
    constructor() {
        this.#jszip = new JSZIP();
    }

    /**
     * 
     * 加载文件
     * 
     * @param {*} blob 
     * @returns 
     */
    async loadBlob(blob) {
        try {
            this.#jszip_loaded = await this.#jszip.loadAsync(blob);
            const target = this.#jszip_loaded.file('content-buffer');
            if (!target) {
                return false;
            }
            this.#content_buffer = await target.async('arraybuffer');
            return true;
        } catch(error) {
            ;
        }
        return false;
    }

    /**
     * 
     * 获取内容
     * 
     * @returns 
     */
    getContentArrayBuffer() {
        return this.#content_buffer;
    }
}
