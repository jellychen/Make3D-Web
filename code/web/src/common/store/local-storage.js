
/**
 * 本地存储
 */
export default {
    /**
     * 
     * 存储
     * 
     * @param {*} k 
     * @param {*} v 
     */
    set(k, v) {
        window.localStorage.setItem(k, v);
    },

    /**
     * 
     * 获取元素
     * 
     * @param {*} k 
     */
    get(k) {
        return window.localStorage.getItem(k);
    },

    /**
     * 
     * 删除元素
     * 
     * @param {*} k 
     */
    remove(k) {
        window.localStorage.removeItem(k);
    },

    /**
     * 清除所有的数据
     */
    clear() {
        window.localStorage.clear();
    },
}
