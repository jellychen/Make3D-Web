/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-slider';

/**
 * 拖拉组件
 */
export default class Slider extends Element {
    /**
     * 元素
     */
    #container;
    #bar;
    #on_value_changed;
    #percent = 0;
    #tips;

    /**
     * 范围
     */
    #range_min = 0;
    #range_max = 1;

    /**
     * tips 字符串转化
     */
    tips_str_convert;

    /**
     * 记录
     */
    #pointer_down_screen_x;
    #pointer_down_percent = 0;

    /**
     * 正在设置
     */
    #is_setting = false;

    /**
     * 设置
     */
    set enable(value) {
        this.setEnable(true === value);
    }

    /**
     * 获取
     */
    get enable() {
        return this.isEnable();
    }

    /**
     * @param {function} callback
     */
    set onchanged(callback) {
        this.setOnChangedCallback(callback);
    }

    /**
     * 获取
     */
    get onchanged() {
        return this.getOnChangedCallback();
    }

    /**
     * 
     * 值是 0 - 1
     * 
     * @param {any} value
     */
    set percent(value) {
        this.setPercent(parseFloat(value));
    }

    /**
     * 值是 0 - 1
     */
    get percent() {
        return this.getPercent();
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
        this.#container = this.getChild('#container');
        this.#bar = this.getChild('#bar');
        this.#tips = this.getChild('#tips');

        // 监听事件
        this.#container.onpointerdown = (event) => {
            if (!this.isEnable()) {
                return;
            }

            this.#container.setPointerCapture(event.pointerId);
            this.#pointer_down_screen_x = event.screenX;
            this.#pointer_down_percent = this.#percent;

            // 显示 tips
            this.#tips.style.visibility = 'visible';
            Animation.FadeIn(this.#tips);
        };

        this.#container.onpointermove = (event) => {
            if (!this.isEnable()) {
                return;
            }

            let current_screen_x = event.screenX;
            if (undefined == this.#pointer_down_screen_x) {
                return;
            }

            let offset = (current_screen_x - this.#pointer_down_screen_x) / this.#container.offsetWidth;
            let current_percent = this.#pointer_down_percent + offset;
            this.setPercent(current_percent);
            this.#onTrigerEvent();
        };

        this.#container.onpointerup = (event) => {
            if (!this.isEnable()) {
                return;
            }
            this.#pointer_down_screen_x = undefined;
            this.#container.releasePointerCapture(event.pointerId);

            // 隐藏tips
            Animation.Try(
                this.#tips,
                {
                    opacity: 0,
                    duration: 500,
                    easing: 'easeOutCubic',
                    onComplete: () => {
                        this.#tips.style.visibility = 'hidden';
                    }
                });
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'percent', 
                'enable',
                'max',
                'min',
            ]);
        }
        return this.attributes;
    }

    /**
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
        
        if ('percent' == name) {
            this.setPercent(parseFloat(_new));
        } else if ('enable' == name) {
            this.setEnable('false' != _new);
        } else if ('min' == name) {
            this.setRangeMin(parseFloat(_new));
        } else if ('max' == name) {
            this.setRangeMax(parseFloat(_new));
        }
    }

    /**
     * 
     * 设置元素可用
     * 
     * @param {*} enable 
     */
    setEnable(enable) {
        if (true === enable) {
            this.#container.setAttribute('enable', 'true');
        } else {
            this.#container.removeAttribute('enable');
        }
    }

    /**
     * 
     * 判断元素是否可用
     * 
     * @returns 
     */
    isEnable() {
        return 'true' === (this.#container.getAttribute('enable'));
    }

    /**
     * 
     * 设置属性变动的时候触发的回调
     * 
     * @param {*} callback 
     */
    setOnChangedCallback(callback) {
        if (isFunction(callback)) {
            this.#on_value_changed = callback;
        } else {
            this.#on_value_changed = undefined;
        }
    }

    /**
     * 
     * 获取回调函数
     * 
     * @returns 
     */
    getOnChangedCallback() {
        return this.#on_value_changed;
    }

    /**
     * 
     * 设置当前的进度 0 - 1
     * 
     * @param {number} percent 
     */
    setPercent(percent) {
        if (!isNumber(percent)) {
            percent = 0;
        }

        percent = Math.clamp(percent, this.#range_min, this.#range_max);
        if (this.#percent == percent) {
            return;
        }
        this.#percent = percent;
        this.#bar.style.width = `${percent * 100}%`;
        
        if (!this.tips_str_convert) {
            this.#tips.innerHTML = `${(percent * 100).toFixed(0)}%`;
        } else {
            this.#tips.innerHTML = this.tips_str_convert(percent);
        }
    }

    /**
     * 
     * 获取当前的进度
     * 
     * @returns 
     */
    getPercent() {
        return this.#percent;
    }

    /**
     * 
     * 设置范围
     * 
     * @param {*} min 
     */
    setRangeMin(min) {
        const v = parseFloat(min);
        if (this.#range_min != v) {
            this.#range_min = v;
            this.setPercent(this.#percent);
        }
    }

    /**
     * 
     * 获取范围
     * 
     * @returns 
     */
    getRangeMin() {
        return this.#range_min;
    }

    /**
     * 
     * 设置范围
     * 
     * @param {*} max 
     */
    setRangeMax(max) {
        const v = parseFloat(max);
        if (this.#range_max != v) {
            this.#range_max = v;
            this.setPercent(this.#percent);
        }
    }

    /**
     * 
     * 获取范围
     * 
     * @returns 
     */
    getRangeMax() {
        return this.#range_max;
    }

    /**
     * 回调和触发事件
     */
    #onTrigerEvent() {
        if (this.#on_value_changed) {
            // 值是 0 - 1
            this.#on_value_changed(this, this.#percent);
        }

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            // 值是 0 - 1
            percent: this.getPercent()
        });
    }
}

CustomElementRegister(tagName, Slider);
