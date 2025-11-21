/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isString        from 'lodash/isString';
import Sprintf         from 'sprintf-js';
import LocalStorage    from '@common/store/local-storage';
import EventDispatcher from '@common/misc/event-dispatcher';

/**
 * 事件type
 */
const notification_event_type = "i18n-lang-changed"

/**
 * local-storage
 */
const local_storage_lang_key = "i18n-lang";

/**
 * 多国语
 */
class Internationalization extends EventDispatcher {
    /**
     * 存储多国语
     */
    #langs_map = new Map();

    /**
     * 当前语言的索引
     */
    #current_index = "";

    /**
     * 当前的使用语言和兜底的语言
     */
    #current;
    #fallback;

    /**
     * 构造函数
     */
    constructor() {
        super();

        // 加载全部的多国语的配置文件
        const context = require.context('@assets/internationalization', true, /\.json$/);
        context.keys().map((item, index) => {
            const k = item.replace('./', '').replace('.json', '');
            const v = context(item);
            this.#langs_map.set(k, v);
        });

        // 设置默认的语言
        this.setFallback('en');

        // 获取设置值
        const current_lang = LocalStorage.get(local_storage_lang_key);
        if (isString(current_lang)) {
            this.setCurrent(current_lang);
        } else if (this.#isSystemChinese()) {
            this.setCurrent('zh');
        } else {
            this.setCurrent('en');
        }
    }

    /**
     * 
     * 判断系统是否是中文
     * 
     * @returns 
     */
    #isSystemChinese() {
        const lang = navigator.language.toLowerCase( );
        return lang === 'zh' || lang.startsWith('zh-');
    }

    /**
     * 
     * 设置fallback
     * 
     * @param {*} k 
     * @returns 
     */
    setFallback(k) {
        if (!this.#langs_map.has(k)) {
            return false;
        }
        this.#fallback = this.#langs_map.get(k);
        this.dispatchEvent(notification_event_type, {});
        return true;
    }

    /**
     * 
     * 设置当前使用的文件
     * 
     * @param {string} k 
     * @returns 
     */
    setCurrent(k) {
        if (!this.#langs_map.has(k)) {
            return false;
        }
        LocalStorage.set(local_storage_lang_key, k);
        this.#current_index = k;
        this.#current = this.#langs_map.get(k);
        this.dispatchEvent(notification_event_type, {});
        return true;
    }

    /**
     * 
     * 获取数据
     * 
     * @param {string} k 
     * @returns 
     */
    data(k) {
        if (this.#current && k in this.#current) {
            return this.#current[k];
        } else if (this.#fallback && k in this.#fallback) {
            return this.#fallback[k];
        }
        return '';
    }

    /**
     * 
     * @param {string} k 
     * @param {Object} _arguments 
     */
    dataFormat(k, _arguments) {
        _arguments = _arguments || {};

        //
        // 获取字符串模板
        // 事例 https://github.com/alexei/sprintf.js
        //
        // var user = {
        //      name: 'Dolly',
        // }
        // Sprintf.sprintf('Hello %(name)s', user) // Hello Dolly
        //
        //
        let tpl = undefined;
        if (this.#current && k in this.#current) {
            tpl = this.#current[k];
        } else {
            tpl = this.#fallback[k];
        }

        // 如果没有直接返回
        if (!tpl) {
            return '';
        }

        return Sprintf.sprintf(tpl, _arguments);
    }

    /**
     * 获取当前的语言
     */
    getCurrent() {
        return this.#current;
    }

    /**
     * 
     * 获取当前语言索引
     * 
     * @returns 
     */
    getCurrentIndex() {
        return this.#current_index;
    }

    /**
     * 获取语言的列表
     */
    getLangsList() {
        const arr = [];
        for (const k of this.#langs_map.keys()) {
            const v = this.#langs_map.get(k);
            const t = v['TAG'] || 'UNKNOWN';
            arr.push({
                name  : t, // 中文 / English
                index : k, // zh / en
            });
        }
        return arr;
    }
}

export default new Internationalization();
