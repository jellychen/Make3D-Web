
import isFunction from 'lodash/isFunction';
import isString   from 'lodash/isString';
import Mitt       from 'mitt';

/**
 * 事件观察者
 */
export default class EventDispatcher {
    /**
     * Mitt
     */
    #mitt_ = new Mitt();

    /**
     * 获取
     */
    get dispatcher() {
        return this.#mitt_;
    }

    /**
     * 构造函数
     */
    constructor() {
        ;
    }

    /**
     * 
     * 监听事件
     * 
     * @param {*} type 
     * @param {function} listener 
     */
    addEventListener(type, listener) {
        if (isString(type) && isFunction(listener)) {
            this.#mitt_.off(type, listener);
            this.#mitt_.on (type, listener);
        }
    }

    /**
     * 
     * 监听事件
     * 
     * @param {*} type 
     * @param {function} listener 
     */
    add(type, listener) {
        this.addEventListener(type, listener);
    }

    /**
     * 
     * 移除对事件的监听
     * 
     * @param {*} type 
     * @param {function} listener 
     */
    removeEventListener(type, listener) {
        if (isString(type) && isFunction(listener)) {
            this.#mitt_.off(type, listener);
        }
    }

    /**
     * 
     * 移除对事件的监听
     * 
     * @param {*} type 
     * @param {function} listener 
     */
    remove(type, listener) {
        this.removeEventListener(type, listener);
    }

    /**
     * 
     * 事件投递
     * 
     * @param {*} event 
     * @param {*} data 
     */
    dispatchEvent(event, data) {
        this.#mitt_.emit(event, data);
    }

    /**
     * 
     * 事件投递
     * 
     * @param {*} event 
     * @param {*} data 
     */
    dispatch(event, data) {
        this.dispatchEvent(event, data);
    }

    /**
     * 移除全部的错误
     */
    removeAll() {
        this.#mitt_.all.forEach((value, key) => {
            this.#mitt_.off(key, value);
        });
    }
}
