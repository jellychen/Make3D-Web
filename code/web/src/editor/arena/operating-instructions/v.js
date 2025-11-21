/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Video_SceneRotate     from '@assets/video/scene-rotate.mp4';
import Desc                  from './v-desc';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-operating-instructions';

/**
 * 显示时间
 */
const MAX_SHOW_TIME = 8000;

/**
 * 操作指引
 */
export default class OperatingInstructions extends Element {
    /**
     * 元素
     */
    #container;
    #video;
    #close;

    /**
     * 关闭定时器
     */
    #timer;
    
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
        this.#container     = this.getChild('#container');
        this.#video         = this.getChild('#video');
        this.#close         = this.getChild('#close');
        this.#close.onclick = () => this.dispose();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        this.#timer = setTimeout(() => this.dispose(), MAX_SHOW_TIME);
        this.#video.muted(true);
        this.#video.playSrc(Video_SceneRotate, true);
        Animation.Try(this.#container, {
            duration   : 360,
            easing     : 'out',
            translateY : [30, 0],
            opacity    : [0, 1],
            onComplete : () => {
                ;
            }
        });
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.#timer);
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(this.#container, {
            duration   : 360,
            easing     : 'out',
            translateY : [0, 30],
            opacity    : [1, 0],
            onComplete : () => {
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, OperatingInstructions);
