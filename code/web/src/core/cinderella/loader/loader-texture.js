/* eslint-disable no-unused-vars */

import isString      from 'lodash/isString';
import isArrayBuffer from 'lodash/isArrayBuffer';
import XThree        from '@xthree/basic';

/**
 * 加载器
 */
const texture_loader = new XThree.TextureLoader();

/**
 * 导出
 */
export default {
    /**
     * 
     * 从ArrayBuffer中加载
     * 
     * @param {*} arraybuffer 
     * @returns 
     */
    async fromArrayBuffer(arraybuffer) {
        if (!isArrayBuffer(arraybuffer)) {
            return;
        }
    
        return new Promise((resolve, reject) => {
            const texture_loader = new XThree.TextureLoader();
            const blob = new Blob([arraybuffer], { type: 'image/png' });
            const url  = URL.createObjectURL(blob);
            texture_loader.load(
                url, 
                texture => {
                    URL.revokeObjectURL(url);
                    resolve(texture);
                },
                undefined,
                err => {
                    URL.revokeObjectURL(url);
                    reject(err);
                }
            );
        });
    },

    /**
     * 
     * 从Url中加载
     * 
     * @param {*} url 
     * @param {*} on_success 
     * @param {*} on_fail 
     * @returns 
     */
    fromUrl(url, on_success, on_fail) {
        if (!isString(url)) {
            return false;
        }
        return texture_loader.load(url, on_success, undefined, on_fail);
    },

    /**
     * 
     * 从Url中加载，异步
     * 
     * @param {*} url 
     * @returns 
     */
    async fromUrlAsync(url) {
        if (!isString(url)) {
            return;
        }

        return new Promise((resolve, reject) => {
            texture_loader.load(
                url, 
                texture => {
                    URL.revokeObjectURL(url);
                    resolve(texture);
                },
                undefined,
                err => {
                    URL.revokeObjectURL(url);
                    reject(err);
                }
            );
        });
    }
}
