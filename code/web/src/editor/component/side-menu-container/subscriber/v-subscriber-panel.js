/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowBenefits          from '../../paid-membership-benefits';
import AccodeVerity          from './v-accode-verify';
import Html                  from './v-subscriber-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-subscriber-panel';

/**
 * 订阅服务窗口
 */
export default class SubscriberPanel extends Element {
    /**
     * 元素
     */
    #container;
    #accode;

    /**
     * 监听消失的回调
     */
    #on_dismiss_callback;

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#container        = this.getChild('#container');
        this.#accode           = this.getChild('#accode');
        this.#accode.on_finish = () => this.dismiss();
        this.onclick           = event => this.#borderBlink();
        this.getChild('#close-btn').addEventListener('click', () => this.dismiss());
        this.getChild('#detail'   ).addEventListener('click', () => this.#onClickDetail());
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Try(this.#container, {
            translateX: [-60, 0],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutCubic',
        });
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 放置位置
     * 
     * @param {*} ref_element 
     * @param {*} placement 
     */
    position(ref_element, placement) {  
        ComputePosition(ref_element, this.#container, placement);
    }

    /**
     * 
     * 点击详情
     * 
     * @param {*} event 
     */
    #onClickDetail(event) {
        ShowBenefits();
        this.dismiss();
    }

    /**
     * 边缘闪烁
     */
    #borderBlink() {
        this.#container.classList.add('highlight');
        setTimeout(() => {
            this.#container.classList.remove('highlight');
        }, 200);
    }

    /**
     * 
     * 监听销毁
     * 
     * @param {Function} callback 
     */
    setOnDismissCallback(callback) {
        this.#on_dismiss_callback = callback;
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Try(this.#container, {
            translateX: -60,
            opacity: 0,
            duration: 400,
            easing: 'easeOutCubic',
            onComplete: () => {
                this.remove();
            }
        });

        if (this.#on_dismiss_callback) {
            this.#on_dismiss_callback();
        }
    }
}

CustomElementRegister(tagName, SubscriberPanel);
