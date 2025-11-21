/* eslint-disable no-unused-vars */

import isNumber                    from 'lodash/isNumber';
import isString                    from 'lodash/isString';
import Animation                   from '@common/misc/animation';
import Moveable                    from '@common/misc/moveable';
import ComputePosition             from '@common/misc/compute-position';
import StopPointerEventPropagation from '@common/misc/stop-pointer-event-propagation';
import CustomElementRegister       from '@ux/base/custom-element-register';
import Element                     from '@ux/base/element';
import ElementDomCreator           from '@ux/base/element-dom-creator';
import Html                        from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-color-selector-panel';

/**
 * 颜色选择器面板
 */
export default class ColorSelectorPanel extends Element {
    /**
     * 元素
     */
    #container;
    #selector;
    #close;
    #footer;
    #footer_confirm;

    /**
     * 事件回调
     */
    #on_color_changed = (event) => this.#onColorChanged(event);
    #on_alpha_changed = (event) => this.#onAlphaChanged(event);

    /**
     * 事件回调
     */
    #on_close_click = (event) => this.#onClose(event);
    #on_blur        = (event) => this.#onBlur(event);
    #on_move_begin  = (     ) => this.#onMoveBegin();
    #on_move_finish = (     ) => this.#onMoveFinish();
    #on_confirm     = (event) => this.#onConfirm(event);

    /**
     * 可移动
     */
    #moveable;

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
        this.#container      = this.getChild('#container');
        this.#selector       = this.getChild('#selector');
        this.#close          = this.getChild('#close');
        this.#footer         = this.getChild('#footer');
        this.#footer_confirm = this.getChild('#confirm');
        StopPointerEventPropagation(this.#selector, true);
        StopPointerEventPropagation(this.#footer, true);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 执行加载的动画
        this.style.opacity = 0;
        Animation.FadeIn(this);

        // 拖动
        this.#moveable = new Moveable(this, this.parentNode);
        this.#moveable.addEventListener('move-begin', this.#on_move_begin);
        this.#moveable.addEventListener('move-finish', this.#on_move_finish);
        this.#moveable.attach();

        // 事件
        this.#close.addEventListener('pointerdown', this.#on_close_click);
        this.#footer_confirm.addEventListener('pointerdown', this.#on_confirm);
        this.#selector.addEventListener('color-changed', this.#on_color_changed);
        this.#selector.addEventListener('alpha-changed', this.#on_alpha_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#close.removeEventListener('pointerdown', this.#on_close_click);
        this.#footer_confirm.removeEventListener('pointerdown', this.#on_confirm);
        this.#moveable.detach();
    }

    /**
     * 
     * 显示或者隐藏关闭按钮
     * 
     * @param {boolean} show 
     */
    showCloseBtn(show) {
        if (true === show) {
            this.#close.style.display = 'block';
        } else {
            this.#close.style.display = 'none';
        }
    }

    /**
     * 
     * 是否在失去焦点的时候移除
     * 
     * @param {boolean} enable 
     */
    setDimissIfBlur(enable) {
        if (true === enable) {
            document.addEventListener("pointerdown", this.#on_blur);
        } else {
            document.removeEventListener("pointerdown", this.#on_blur);
        }
    }

    /**
     * 
     * 动态摆放
     * 
     * @param {*} reference_element 
     * @param {string} placement 
     */
    place(reference_element, placement="top") {
        if (!isString(placement)) {
            return;
        }
        ComputePosition(reference_element, this, placement);
    }

    /**
     * 
     * 移除
     * 
     * @param {boolean} animation 
     */
    dismiss(animation) {
        if (true === animation) {
            Animation.Remove(this);
        } else {
            this.remove();
        }
        this.dispatchUserDefineEvent("dismiss");
    }

    /**
     * 
     * 失去焦点
     * 
     * @param {*} event 
     */
    #onBlur(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.dismiss(true);
    }

    /**
     * 开始拖动
     */
    #onMoveBegin() {
        this.#container.classList.add("moving");
    }

    /**
     * 拖动结束
     */
    #onMoveFinish() {
        this.#container.classList.remove("moving");
    }

    /**
     * 
     * 点击确认按钮
     * 
     * @param {*} event 
     */
    #onConfirm(event) {
        this.dismiss(true);
    }

    /**
     * 
     * 关闭回调
     * 
     * @param {*} event 
     */
    #onClose(event) {
        this.dismiss(true);
    }

    /**
     * 
     * 颜色变化
     * 
     * @param {*} event 
     */
    #onColorChanged(event) {
        // 发送事件
        this.dispatchUserDefineEvent('color-changed', {
            hex: event.hexColor,
            hexValue: event.hexValue,
        });
    }

    /**
     * 
     * 透明度变化
     * 
     * @param {*} event 
     */
    #onAlphaChanged(event) {
        // 发送事件
        this.dispatchUserDefineEvent('alpha-changed', {
            alpha: event.alpha,
        });
    }

    /**
     * 
     * 开启或者关闭 Alpha 的调节
     * 
     * @param {boolean} enable 
     */
    setEnableAlpha(enable) {
        this.#selector.setEnableAlpha(true === enable);
    }

    /**
     * 
     * 设置显示的alpha
     * 
     * @param {Number} alpha 
     */
    setAlpha(alpha) {
        if (isNumber(alpha)) {
            this.#selector.setPanAlpha(alpha);
        }
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setColorRGB(r, g, b) {
        this.#selector.setPanColorRGB(
            parseFloat(r), 
            parseFloat(g), 
            parseFloat(b));
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#selector.setPanColor(color);
    }
}

CustomElementRegister(tagName, ColorSelectorPanel);
