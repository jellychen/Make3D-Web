/* eslint-disable no-unused-vars */

import isNull      from 'lodash/isNull';
import isNumber    from 'lodash/isNumber';
import isUndefined from 'lodash/isUndefined';
import XThree      from '@xthree/basic';
import LruCache    from "@common/misc/lru-cache";
import ToImageUrl  from './texture-to-image';

/**
 * 最大存储的数量
 */
const MAX_COUNT = 64;

/**
 * threejs texture 转图片，并且支持lru
 */
class TextureToImageLruCenter {
    /**
     * LRU
     */
    #cache = new LruCache(MAX_COUNT);

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 转文本
     * 
     * @param {*} texture 
     * @param {*} w 
     * @param {*} h 
     */
    toImage(texture, w, h) {
        if (!isNumber(w) || w <= 0 || !isNumber(h) || h <= 0) {
            return null;
        }

        if (!texture || !(texture instanceof XThree.Texture)) {
            return null;
        }

        let k = `${texture.uuid}:${w}:${h}`;
        let v = this.#cache.get(k);
        if (isUndefined(v) || isNull(v)) {
            v = ToImageUrl(texture, w, h);
            this.#cache.set(k, v);
        }
        return v;
    }

    /**
     * 清空 cache
     */
    clear() {
        this.#cache.clear();
    }
}

export default new TextureToImageLruCenter();
