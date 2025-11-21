/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import cloneDeep            from 'lodash/cloneDeep';
import Internationalization from './index';

/**
 * 用来打包语料
 */
export default class BundleData {
    /**
     * 数据类型
     * 
     * 0 是Raw
     * 1 是Token
     * 2 是Token-Tpl
     * 
     */
    #type = 0;

    /**
     * 数据或者Token
     */
    #raw_or_token = '';

    /**
     * tpl 参数
     */
    #tpl_arguments;

    /**
     * 获取最后的数据
     */
    get data() {
        if (0 == this.#type) {
            return this.#raw_or_token;
        } else if (1 == this.#type) {
            return Internationalization.data(this.#raw_or_token);
        } else if (2 == this.#type) {
            return Internationalization.dataFormat(this.#raw_or_token, this.#tpl_arguments);
        }
        return '';
    }

    /**
     * 
     * 构建Raw
     * 
     * @param {String} data 
     */
    static MakeRaw(data) {
        const bundle = new BundleData();
        bundle.setRaw(data);
        return bundle;
    }

    /**
     * 
     * 构建token
     * 
     * @param {*} token 
     * @returns 
     */
    static MakeToken(token) {
        const bundle = new BundleData();
        bundle.setToken(token);
        return bundle;
    }

    /**
     * 
     * 构建模板和参数
     * 
     * @param {*} token 
     * @param {*} _arguments 
     */
    static MakeTokenTplWithArguments(token, _arguments = {}) {
        const bundle = new BundleData();
        bundle.setTokenTplWithArguments(token, _arguments);
        return bundle;
    }

    /**
     * 
     * 设置Raw
     * 
     * @param {string} data 
     */
    setRaw(data) {
        this.#type = 0;
        this.#raw_or_token = data || '';
        this.#tpl_arguments = {};
    }

    /**
     * 
     * 设置Token
     * 
     * @param {string} token 
     */
    setToken(token) {
        this.#type = 1;
        this.#raw_or_token = token || '';
        this.#tpl_arguments = {};
    }

    /**
     * 
     * 设置Token模板
     * 
     * @param {string} token 
     * @param {*} _arguments 
     */
    setTokenTplWithArguments(token, _arguments = {}) {
        this.#type = 2;
        this.#raw_or_token = token || '';
        this.#tpl_arguments = cloneDeep(_arguments || {});
    }

    /**
     * 
     * 是否是令牌
     * 
     * @returns 
     */
    isToken() {
        return 1 == this.#type || 2 == this.#type;
    }

    /**
     * 
     * 是否是模版
     * 
     * @returns 
     */
    isTokenTpl() {
        return 2 == this.#type;
    }

    /**
     * 
     * 如果是模板，替换参数
     * 
     * @param {Object} _arguments 
     */
    setArgumentsIfIsTokenTpl(_arguments = {}) {
        this.#tpl_arguments = cloneDeep(_arguments || {});
    }

    /**
     * 深度拷贝
     */
    deepClone() {
        let data = new BundleData();
        data.#type = this.#type;
        data.#raw_or_token = this.#raw_or_token;
        data.#tpl_arguments = cloneDeep(this.#tpl_arguments || {});
        return data;
    }
}
