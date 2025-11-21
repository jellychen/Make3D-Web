
import Cookies from 'js-cookie';

/**
 * Cookies 设置
 */
export default {
    /**
     * 
     * 设置
     * 
     * @param {*} k 
     * @param {*} v 
     * @param {*} expires_days 
     * @param {*} path 
     */
    set(k, v, expires_days =  -1, path = '') {
        if (expires_days > 0) {
            Cookies.set(k, v, { expires: expires_days, path: path });
        } else {
            Cookies.set(k, v, { path: path });
        }
    },

    /**
     * 
     * 获取
     * 
     * @param {*} k 
     */
    get(k) {
        return Cookies.get(k);
    },

    /**
     * 
     * 移除
     * 
     * @param {*} k 
     * @param {*} path 
     */
    remove(k, path = '') {
        Cookies.remove(k, { path: path })
    }
}
