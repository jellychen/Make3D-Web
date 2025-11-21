/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import isString                 from 'lodash/isString';
import Animation                from '@common/misc/animation';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Cache                    from './cache';
import GetDao                   from './dao';
import EnvmapSelectorCell       from './v-cell';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-envmap-selector';

/**
 * HDR 选择器
 */
export default class EnvmapSelector extends Element {
    /**
     * 元素
     */
    #scrollable_container;
    #scrollable_container_content;
    #loading;

    /**
     * 数据
     */
    #dao;

    /**
     * 外部回调
     */
    on_selected;

    /**
     * 事件回调
     */
    #on_dismiss = event => this.#onDismiss(event);

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#scrollable_container = this.getChild('#scrollable-container');
        this.#scrollable_container_content = this.getChild('#scrollable-container-content');
        this.#loading = this.getChild('#loading');

        // 获取数据
        GetDao((data) => {
            if (false === data) {
                return;
            } else {
                this.#dao = data;
                this.#onDaoGetted();
            }
        });
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * Dao数据
     */
    #onDaoGetted() {
        this.#scrollable_container.style.display = 'block';
        this.#loading.remove();
        this.#loading = undefined;

        // 构建 Cell
        for (const key in this.#dao) {
            const item = this.#dao[key];
            const cell = new EnvmapSelectorCell(this, this.#dao, key, token => {
                this.#onItemSelected(token);
            });

            if (!item.cached) {
                cell.setNeedDownload();
            }
            
            cell.setThumbUrl(item.thumb);
            
            this.#scrollable_container_content.appendChild(cell);
        }
    }

    /**
     * 
     * 被选中
     * 
     * @param {string} token 
     */
    #onItemSelected(token) {
        if (!isString(token)) {
            return;
        }

        // 获取微缩图
        const thumb_url = this.#dao[token].thumb;

        //
        // 从数据中获取
        // data => null 或者 blob
        //
        Cache.getItem(token, data => {
            if (data instanceof Blob) {
                if (isFunction(this.on_selected)) {
                    this.on_selected(data, thumb_url);
                }
            }
        });

        // 销毁
        this.dismiss();
    }

    /**
     * 
     * 点击其他地方 消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.dismiss();
    }

    /**
     * 销毁
     */
    dismiss() {
        this.style.pointerEvents = 'none';
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, EnvmapSelector);
