/* eslint-disable no-unused-vars */

import AssetsLotties         from '@assets/assets-lotties';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import LottieWeb             from 'lottie-web';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-lottie';

/**
 * 动画
 */
export default class Lottie extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 播放器
     */
    #lottie_data;
    #lottie;

    /**
     * 播放器 控制
     */
    #lottie_autoplay = false;
    #lottie_loop = false;

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
        this.#container = this.getChild('#container');
    }

    /**
     * 元素添加到DOM上面的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 构建
        if (this.#lottie_data) {
            this.#lottie = LottieWeb.loadAnimation({
                container: this.#container,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: this.#lottie_data,
            });   
        }

        // 播放控制
        if (this.#lottie) {

            // 循环
            if (this.#lottie_loop) {
                this.#lottie.setLoop(true);
            }

            // 自动播放
            if (this.#lottie_autoplay) {
                this.#lottie.play();
            }
        }
    }

    /**
     * 元素从Dom上面移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();

        // 销毁
        this.reset();
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "src", 
                "autoplay", 
                "loop"
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('src' == name) {
            this.setFileData(_new);
        } else if ('autoplay' == name) {
            this.#lottie_autoplay = 'true' === _new;
        } else if ('loop' == name) {
            this.#lottie_loop = 'true' === _new;
        }
    }

    /**
     * 
     * 从文件中加载
     * 
     * @param {*} name 
     */
    setFileData(name) {
        this.setData(AssetsLotties(name));
    }

    /**
     * 
     * 设置数据
     * 
     * @param {*} data 
     */
    setData(data) {
        this.#lottie_data = data;
        if (this.#lottie) {
            this.reset();
            this.#lottie = LottieWeb.loadAnimation({
                container: this.#container,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: data
            });
        }
    }

    /**
     * 播放
     */
    play() {
        if (this.#lottie) {
            this.#lottie.play();
        }
    }

    /**
     * 暂停
     */
    pause() {
        if (this.#lottie) {
            this.#lottie.pause();
        }
    }

    /**
     * 停止
     */
    stop() {
        if (this.#lottie) {
            this.#lottie.stop();
        }
    }

    /**
     * 
     * 设置循环
     * 
     * @param {boolean} loop 
     */
    setLoop(loop) {
        if (this.#lottie) {
            this.#lottie.setLoop(true === loop);
        }
    }

    /**
     * 重置
     */
    reset() {
        if (this.#lottie) {
            this.#lottie.stop();
            this.#lottie.destroy();
            this.#lottie = undefined;
        }
    }
}

CustomElementRegister(tagName, Lottie);