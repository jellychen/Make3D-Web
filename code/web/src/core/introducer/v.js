/* eslint-disable no-unused-vars */

import isArray               from 'lodash/isArray';
import cloneDeep             from 'lodash/cloneDeep';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Tips                  from './v-hover-tips';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-introducer';

/**
 * 介绍者
 */
export default class Introducer extends Element {
    /**
     * 元素
     */
    #container;
    #hover;
    #tips;

    /**
     * 尺寸变化
     */
    #resize_observer;

    /**
     * 配置项
     */
    #conf;
    #conf_cur;

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
        this.#container       = this.getChild('#container');
        this.#hover           = this.getChild('#hover');
        this.#tips            = this.getChild('#tips');
        this.#tips.on_close   = () => this.#onClickClose();
        this.#tips.on_next    = () => this.#onClickNext ();
        this.#tips.on_last    = () => this.#onClickLast ();
        this.#resize_observer = new ResizeObserver(() => {
            this.#onResize();
        });
        this.#resize_observer.observe(this.#container);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} conf 
     * @returns 
     */
    setConf(conf) {
        if (!isArray(conf)) {
            return;
        } else if (conf.length == 0) {
            return;
        }
        this.#conf = cloneDeep(conf);
        this.#conf_cur = 0;
        this.#update(true);
    }

    /**
     * 
     * 更新
     * 
     * @param {*} atonce 
     * @returns 
     */
    #update(atonce = false) {
        if (!isArray(this.#conf)) {
            return;
        } else if (this.#conf_cur >= this.#conf.length) {
            return;
        }

        const item = this.#conf[this.#conf_cur];
        const conf = {};
        conf.element     = item.element;
        conf.desc        = item.desc;
        conf.enable_last = this.#conf_cur > 0;
        conf.enable_next = true;
        conf.current     = this.#conf_cur;
        conf.total       = this.#conf.length;
        this.#updateConfItem(conf, atonce);
    }

    /**
     * 
     * 更新属性
     * 
     * @param {*} conf_item 
     * @param {*} atonce 
     */
    #updateConfItem(conf_item, atonce = false) {
        const element     = conf_item.element;
        const desc        = conf_item.desc;
        const enable_next = conf_item.enable_next;
        const enable_last = conf_item.enable_last;
        const current     = conf_item.current;
        const total       = conf_item.total;
        this.#setHoverPosition(element, atonce);
        this.#tips.setTextToken(desc);
        this.#tips.setEnableNext(enable_next);
        this.#tips.setEnableLast(enable_last);
        this.#tips.setProgress(current + 1, total);
    }

    /**
     * 
     * 设置Hover的位置
     * 
     * @param {*} element 
     * @param {*} atonce 
     */
    #setHoverPosition(element, atonce = false) {
        const r = element.getBoundingClientRect();
        const x = r.left;
        const y = r.top;
        const w = r.width;
        const h = r.height;

        //
        // 考虑到hover有一个 1px 的border
        //
        this.#hover.style.left   = `${x - 6 }px`;
        this.#hover.style.top    = `${y - 6 }px`;
        this.#hover.style.width  = `${w + 10}px`;
        this.#hover.style.height = `${h + 10}px`;
        this.#updateTipsPosition(atonce);
    }

    /**
     * 
     * 更新位置
     * 
     * @param {*} atonce 
     */
    #updateTipsPosition(atonce = false) {
        this.#tips.updatePosition(this.#hover, atonce);
    }

    /**
     * 点击关闭
     */
    #onClickClose() {
        this.dispose();
    }

    /**
     * 点击上一个
     */
    #onClickLast() {
        this.#conf_cur--;
        if (this.#conf_cur < 0) {
            this.#conf_cur = 0;
        }
        this.#update();
    }

    /**
     * 点击下一个
     */
    #onClickNext() {
        this.#conf_cur++;
        if (this.#conf_cur == this.#conf.length) {
            this.dispose();
        } else {
            this.#update();
        }
    }

    /**
     * 更新
     */
    #onResize() {
        this.#update();
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Remove(this, () => {
            this.remove();
        });
    }
}

CustomElementRegister(tagName, Introducer);
