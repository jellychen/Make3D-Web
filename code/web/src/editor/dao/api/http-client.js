/* eslint-disable no-unused-vars */

/**
 * Http接口
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Response
 * 
 * const hc = new HttpClient();
 * hc.setMethod('GET');
 * hc.setUrl('https://localhost:8080/workbench.html');
 * const r = await hc.Exec()
 * console.log(await r.text())
 * 
 */
export default class HttpClient {
    /**
     * 配置数据
     */
    #conf = {
        method  : "GET",
        cache   : "no-cache",
        mode    : "cors",
        redirect: "follow",
        headers : {'Content-Type': 'text/plain'},
        body    : undefined,
        signal  : undefined,
    };

    /**
     * URL
     */
    #url = "";

    /**
     * URL 参数
     */
    #query = {}

    /**
     * post 参数
     */
    #post_params;

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 
     * 设置方法
     * 
     * @param {string} method 
     * @returns 
     */
    setMethod(method = 'GET') {
        this.#conf.method = method;
        return this;
    }

    /**
     * 
     * 设置缓存的策略
     * 
     * @param {string} cache 
     * @returns 
     */
    setCache(cache) {
        this.#conf.cache = cache;
        return this;
    }

    /**
     * 
     * 设置模式
     * 
     * @param {string} mode 
     * @returns 
     */
    setMode(mode) {
        this.#conf.mode = mode;
        return this;
    }

    /**
     * 
     * 设置
     * 
     * @param {string} redirect 
     * @returns 
     */
    setRedirect(redirect) {
        this.#conf.redirect = redirect;
        return this;
    }

    /**
     * 
     * 设置空
     * 
     * @returns 
     */
    setHeadersEmpty() {
        this.#conf.headers = {}
        return this;
    }

    /**
     * 
     * 设置头部
     * 
     * @param {*} k 
     * @param {*} v 
     * @returns 
     */
    setHeader(k, v) {
        this.#conf.headers[k] = v;
        return this;
    }

    /**
     * 
     * 设置URL
     * 
     * @param {string} url 
     * @returns 
     */
    setUrl(url) {
        this.#url = url;
        return this;
    }

    /**
     * 
     * 设置URL参数
     * 
     * @returns 
     */
    setQueryEmpty() {
        this.#query = {};
        return this;
    }

    /**
     * 
     * 设置URL参数
     * 
     * @param {*} k 
     * @param {*} v 
     * @returns 
     */
    setQuery(k, v) {
        this.#query[k] = v;
        return this;
    }

    /**
     * 
     * 设置 formdata
     * 
     * @returns 
     */
    setPostParamsEmpty() {
        this.#post_params = '';
        return this;
    }

    /**
     * 
     * 设置post数据
     * 
     * @param {*} object 
     * @returns 
     */
    setPostParams(data) {
        this.#post_params = data;
        return this;
    }

    /**
     * 
     * 执行
     * 
     * @param {*} timeout 
     * @returns 
     */
    async Exec(timeout = 10000) {
        const params        = new URLSearchParams();
        for (const key in this.#query) {
            params.set(key, this.#query[key])
        }

        let url             = this.#url;
        let query_string    = params.toString();
        if (""             != query_string) {
            url             = `${url}?${query_string}`
        }

        if ('POST'          == this.#conf.method) {
            this.#conf.body = this.#post_params;
        } else {
            this.#conf.body = undefined;
        }

        const controller    = new AbortController();
        this.#conf.signal   = controller.signal;
        const timeout_id    = setTimeout(() => controller.abort(), timeout);
        const response      = await fetch(url, this.#conf);
        clearTimeout(timeout_id);

        return response;
    }
}
