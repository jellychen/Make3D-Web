/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import DaoLoader                from './dao-loader';
import Html                     from './v-cell-status-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-envmap-selector-cell-status';

/**
 * 状态值
 */
export default class EnvmapSelectorCellStatus extends Element {
    /**
     * 事件回调
     */
    on_click_download;

    /**
     * 元素
     */
    #loading;
    #download;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.showDownload();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#loading = this.getChild('#loading');
        this.#download = this.getChild('#download');
        this.#download.addEventListener('click', () => {
            if (isFunction(this.on_click_download)) {
                this.on_click_download();
            }
        });
    }

    /**
     * 显示加载动画
     */
    showLoading() {
        this.#download.style.display = 'none';
        this.#loading.style.display  = 'block';
    }

    /**
     * 显示加载按钮
     */
    showDownload() {
        this.#download.style.display = 'block';
        this.#loading.style.display  = 'none';
    }
}

CustomElementRegister(tagName, EnvmapSelectorCellStatus);
