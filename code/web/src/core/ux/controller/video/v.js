/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-video';

/**
 * 播放器
 */
export default class Video extends Element {
    /**
     * 元素
     */
    #video;

    /**
     * 获取
     */
    get video() {
        return this.#video;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(false);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#video = this.getChild('#video');
    }

    /**
     * 
     * 是否静音
     * 
     * @param {*} enable 
     */
    muted(enable) {
        this.#video.muted = enable;
    }

    /**
     * 
     * 播放指定的视频
     * 
     * @param {*} src 
     * @param {*} loop 
     */
    playSrc(src, loop = false) {
        this.#video.src = src;
        this.#video.load();
        this.#video.loop = loop;
        this.#video.play().catch(err => {
            console.error(err);
        });
    }
}

CustomElementRegister(tagName, Video);