/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Resizer               from '@ux/base/element-resizer';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-dashboard';

/**
 * 获取
 */
export default class Dashboard extends Element {
    /**
     * 元素
     */
    #container;
    #slider;
    #content;
    #mask;

    /**
     * 使用内容决定高度
     */
    #use_content_size = false;

    /**
     * 滑动
     */
    #container_vertical_resizer;

    /**
     * 监听
     */
    #resize_observer;

    /**
     * 获取
     */
    get content() {
        return this.#content;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.setEnableCustomizeMenu(true);
        this.#container = this.getChild('#container');
        this.#slider    = this.getChild('#slider');
        this.#content   = this.getChild('#content');
        this.#mask      = this.getChild('#mask');
        this.#container_vertical_resizer = new Resizer(this.#slider, this);
        this.#container_vertical_resizer.attach(false, true);
        this.#container_vertical_resizer.setReverse(true);
        this.#container_vertical_resizer.on_end = () => this.#onResizerEnd();
        this.#resize_observer = new ResizeObserver(entries => {
            this.#onSizeChanged();
        });
        this.#resize_observer.observe(this);
    }

    /**
     * 
     * 设置使用内容的尺寸
     * 
     * @param {*} use 
     */
    setUseContentSize(use) {
        if (use) {
            this.#use_content_size     = true;
            this.#slider.style.display = 'none';
            this.style.height          = 'auto';
            this.#container.setAttribute("useContentSize", 'true');
            this.#content  .setAttribute("useContentSize", 'true');
        } else {
            this.#use_content_size     = false;
            this.#slider.style.display = 'block';
            this.style.height          = '60%';
            this.#container.setAttribute("useContentSize", 'false');
            this.#content  .setAttribute("useContentSize", 'false');
        }
    }

    /**
     * 监听尺寸监听
     */
    #onSizeChanged() {
        if (!this.#use_content_size) {
            if (this.offsetHeight <= 20) {
                this.#mask.style.display = 'block';
            } else {
                this.#mask.style.display = 'none';
            }
        }
    }

    /**
     * 拖动结束
     */
    #onResizerEnd() {
        //
        // 交互优化
        //
        // 如果拖动太靠下面
        // 就移除
        //
        if (this.offsetHeight <= 20) {
            this.setShow(false);
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} show 
     */
    setShow(show) {
        if (show) {
            const current_height = parseFloat(this.style.height); 
            if (isNaN(current_height)) {
                this.style.height  = '60%';
            }
            this.style.display = 'block';
        } else {
            this.clear();
            this.style.display = 'none';
        }
    }

    /**
     * 清理
     */
    clear() {
        while (true) {
            const child = this.#content.firstChild;
            if (!child) {
                break;
            }

            if (isFunction(child.willRemoved)) {
                try {
                    child.willRemoved();
                } catch(e) {
                    console.error(e);
                }
            }
            
            this.#content.removeChild(child);
        }
        this.style.display = 'none';
    }
}

CustomElementRegister(tagName, Dashboard);
