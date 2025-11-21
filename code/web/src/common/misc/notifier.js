/* eslint-disable no-unused-vars */

import Mitt from 'mitt';

/**
 * 统一通知
 */
class Notifier {
    /**
     * 订阅
     */
    #mitt_ = new Mitt();

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 添加回调
     * 
     * @param {*} type 
     * @param {*} callback 
     */
    add(type, callback) {
        this.addEventListener(type, callback);
    }

    /**
     * 
     * 添加回调
     * 
     * @param {*} type 
     * @param {*} callback 
     */
    addEventListener(type, callback) {
        this.#mitt_.on(type, callback);
    }

    /**
     * 
     * 移除回调
     * 
     * @param {*} type 
     * @param {*} callback 
     */
    del(type, callback) {
        this.removeEventListener(type, callback);
    }

    /**
     * 
     * 移除回调
     * 
     * @param {*} type 
     * @param {*} callback 
     */
    removeEventListener(type, callback) {
        this.#mitt_.off(type, callback);
    }

    /**
     * 
     * 分发回调
     * 
     * @param {*} type 
     * @param {*} _data 
     */
    dispatch(type, _data) {
        this.#mitt_.emit(type, _data);
    }
}

export default new Notifier();
