
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

/**
 * 用来存储URL
 */
export default class LocalFileUrlsContainer {
    /**
     * 容器
     */
    #container = new Map();

    /**
     * 
     * string
     * 
     * @param {*} url 
     */
    add(url) {
        if (!isString(url)) {
            return -1;
        }

        let ref_count = this.#container.get(url);
        if (isNumber(ref_count)) {
            ref_count++;
        } else {
            ref_count = 1;
        }

        this.#container.set(url, ref_count);
        return ref_count;
    }

    /**
     * 
     * string
     * 
     * @param {*} url 
     */
    remove(url) {
        if (!isString(url)) {
            return -1;
        }

        let ref_count = this.#container.get(url);
        if (!isNumber(ref_count)) {
            return -1;
        }

        ref_count--;

        if (0 == ref_count) {
            this.#container.delete(url);
        }
        return ref_count;
    }
}
