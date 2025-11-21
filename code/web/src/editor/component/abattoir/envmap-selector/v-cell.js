/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import DaoLoader                from './dao-loader';
import EnvmapSelectorCellStatus from './v-cell-status';
import Html                     from './v-cell-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-envmap-selector-cell';

/**
 * HDR 选择器
 */
export default class EnvmapSelectorCell extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #container;
    #thumb;

    /**
     * 数据
     */
    #dao;

    /**
     * 标识
     */
    #token;

    /**
     * 用来显示状态
     */
    #status;

    /**
     * 回调函数
     */
    #on_selected;

    /**
     * 获取
     */
    get token() {
        return this.#token;
    }

    /**
     * 获取
     */
    get dao() {
        return this.#dao;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     * @param {*} dao 
     * @param {*} token 
     */
    constructor(host, dao, token, on_selected) {
        super(tagName);
        this.#host = host;
        this.#dao = dao;
        this.#token = token;
        this.#on_selected = on_selected;
        if (!isFunction(this.#on_selected)) {
            this.#on_selected = () => {};
        }
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#thumb = this.getChild('#thumb');
        this.#thumb.addEventListener('click', event => this.#onThumbClick(event));
    }

    /**
     * 
     * 设置微缩图的网址
     * 
     * @param {string} url 
     */
    setThumbUrl(url) {
        this.#thumb.setSrc(url);
    }

    /**
     * 设置需要下载
     */
    setNeedDownload() {
        if (!this.#status) {
            this.#status = new EnvmapSelectorCellStatus();
            this.#container.appendChild(this.#status);
            this.#status.on_click_download = () => this.#onDownloadBtnClick();
        }
        this.#status.showDownload();
    }

    /**
     * 点击下载
     */
    #onDownloadBtnClick() {
        // 显示加载动画
        if (this.#status) {
            this.#status.showLoading();
        }

        // 执行下载
        DaoLoader(this.#dao, this.#token, (data) => {
            
            // 下载失败
            if (false === data) {
                if (this.#status) {
                    this.#status.showDownload();
                }
            }

            // 下载成功
            else {
                if (this.#status) {
                    this.#status.remove();
                    this.#status = undefined;
                }
            }
        });
    }

    /**
     * 
     * 点击了微缩图
     * 
     * @param {*} event 
     */
    #onThumbClick(event) {
        if (isFunction(this.#on_selected)) {
            this.#on_selected(this.#token);
        }
    }
}

CustomElementRegister(tagName, EnvmapSelectorCell);
