/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-btn-play-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-controller-btn-play';

/**
 * 常量
 */
const ICON_PLAY  = 'ui/play-0.svg' ;
const ICON_PAUSE = 'ui/pause-0.svg';

/**
 * 播放按钮
 */
export default class BtnPlay extends Element {
    /**
     * 元素
     */
    #icon;

    /**
     * 是否在播放
     */
    #is_playing = false;

    /**
     * 是否在播放中
     */
    get is_playing() {
        return this.#is_playing;
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.createContentFromTpl(tpl);
        this.addEventListener('click', event => this.#onClick(event));
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#icon = this.getChild('#icon');
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        this.#is_playing = !this.#is_playing;
        this.setStatus(this.#is_playing);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} is_playing 
     */
    setStatus(is_playing) {
        this.#is_playing = true == is_playing;
        if (this.#is_playing) {
            this.#icon.setIcon(ICON_PAUSE);
        } else {
            this.#icon.setIcon(ICON_PLAY);
        }
    }
}

CustomElementRegister(tagName, BtnPlay);
