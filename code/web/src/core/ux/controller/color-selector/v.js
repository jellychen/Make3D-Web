/* eslint-disable no-unused-vars */

import Chroma                from "chroma-js";
import isNumber              from 'lodash/isNumber';
import isString              from 'lodash/isString';
import GlobalScope           from '@common/global-scope';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-color-selector';

/**
 * 颜色选择器
 */
export default class ColorSelector extends Element {
    /**
     * 元素
     */
    #pan;
    #pan_brief;
    #hue;
    #alpha_container;
    #color_gradient;

    /**
     * 操作手柄
     */
    #handle_pan;
    #handle_hue;
    #handle_alp;

    /**
     * 事件回调
     */
    #on_pan_pointer_down;
    #on_pan_pointer_move;
    #on_pan_pointer_up;
    #on_pan_pointer_cancel;

    /**
     * hue 事件回调
     */
    #on_hue_pointer_down;
    #on_hue_pointer_move;
    #on_hue_pointer_up;
    #on_hue_pointer_cancel;

    /**
     * alpha 事件回调
     */
    #on_alpha_pointer_down;
    #on_alpha_pointer_move;
    #on_alpha_pointer_up;
    #on_alpha_pointer_cancel;

    /**
     * 显示RGB的数据
     */
    #r;
    #g;
    #b;

    /**
     * Chrome的颜色提取器
     */
    #color_picker;

    /**
     * 
     * 用来存储
     * 
     * 从上到下亮度从 50% 到 0%，从由向左饱和度从 0% 到 100%
     * 
     * 
     */
    #h = 0;     // 0 - 360
    #s = 0;     // 0 - 100
    #l = 100;   // 0 - 100
    #a = 0;

    /**
     * hsl 合并 的 Color Hex, 字符串
     */
    #hex_color;

    /**
     * 获取Alpha通道
     */
    get alpha() {
        return this.#a;
    }

    /**
     * 获取当前的颜色， 字符串
     */
    get hexColor() {
        return this.#hex_color;
    }

    /**
     * 获取当前的颜色，Hex数字
     */
    get hexValue() {
        const rgb = Chroma.hsl(this.#h, this.#s / 100, this.#l / 100).rgb();
        const r = rgb[0];
        const g = rgb[1];
        const b = rgb[2];
        return (r << 16) + (g << 8) + b;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);

        // 事件回调
        this.#on_pan_pointer_down       = (event) => this.#onPanPointerDown(event);
        this.#on_pan_pointer_move       = (event) => this.#onPanPointerMove(event);
        this.#on_pan_pointer_up         = (event) => this.#onPanPointerUp(event);
        this.#on_pan_pointer_cancel     = (event) => this.#onPanPointerCancel(event);

        // hue 事件回调
        this.#on_hue_pointer_down       = (event) => this.#onHuePointerDown(event);
        this.#on_hue_pointer_move       = (event) => this.#onHuePointerMove(event);
        this.#on_hue_pointer_up         = (event) => this.#onHuePointerUp(event);
        this.#on_hue_pointer_cancel     = (event) => this.#onHuePointerCancel(event);

        // alpha 事件回调
        this.#on_alpha_pointer_down     = (event) => this.#onAlphaPointerDown(event);
        this.#on_alpha_pointer_move     = (event) => this.#onAlphaPointerMove(event);
        this.#on_alpha_pointer_up       = (event) => this.#onAlphaPointerUp(event);
        this.#on_alpha_pointer_cancel   = (event) => this.#onAlphaPointerCancel(event);

        // 创建UI
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();

        // 元素
        this.#pan             = this.getChild('#pan');
        this.#pan_brief       = this.getChild('#pan-brief');
        this.#hue             = this.getChild('#h');
        this.#r               = this.getChild('#R');
        this.#g               = this.getChild('#G');
        this.#b               = this.getChild('#B');
        this.#alpha_container = this.getChild('#alpha-container');
        this.#color_gradient  = this.getChild('#color-gradient');
        this.#handle_pan      = this.getChild('#pan-handle');
        this.#handle_hue      = this.getChild('#h-handle');
        this.#handle_alp      = this.getChild('#alpha-handle');

        // Chrome内置的颜色取色器
        this.#color_picker = this.getChild('#color-picker');
        if (!window.EyeDropper) {
            this.#color_picker.setAttribute('disable', "true");
            this.#color_picker.onpointerdown = () => {
                GlobalScope.alertBox({
                    icon: "warn",
                    text_content: "The ColorPicker is not supported in browsers other than Chrome.",
                });
            };
        } else {
            this.#color_picker.onpointerdown = () => {
                try {
                    new EyeDropper().open().then(color => {
                        const rgb = Chroma.hex(color.sRGBHex).rgb();
                        this.setPanColorRGB(rgb[0], rgb[1], rgb[2]);
                        this.dispatchUserDefineEvent('color-changed', {
                            hex: this.hexColor,
                            hexValue: this.hexValue,
                        });
                    });
                } catch(e) {
                    console.log(e);
                }
            };
        }

        // 事件安装
        this.#setupPan();
        this.#setupHue();
        this.#setupAlpha();
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#updateHue();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#uninstallPan();
        this.#uninstallHue();
        this.#uninstallAlpha();
    }

    /**
     * 
     * 开启或者关闭 Alpha 的调节
     * 
     * @param {boolean} enable 
     */
    setEnableAlpha(enable) {
        if (true === enable) {
            this.#alpha_container.style.display = "block";
        } else {
            this.#alpha_container.style.display = "none";
        }
    }

    /**
     * 安装Pan的事件回调
     */
    #setupPan() {
        this.#pan.addEventListener('pointerdown', this.#on_pan_pointer_down);
    }

    /**
     * 协助Pan的事件回调
     */
    #uninstallPan() {
        this.#pan.removeEventListener('pointerdown',   this.#on_pan_pointer_down);
        this.#pan.removeEventListener('pointermove',   this.#on_pan_pointer_move);
        this.#pan.removeEventListener('pointerup',     this.#on_pan_pointer_up);
        this.#pan.removeEventListener('pointercancel', this.#on_pan_pointer_cancel);
    }

    /**
     * 
     * Pan事件
     * 
     * @param {*} event 
     */
    #onPanPointerDown(event) {
        event.stopPropagation();
        this.#pan_brief.style.visibility = 'visible';
        this.#pan.setPointerCapture(event.pointerId);
        this.#pan.addEventListener('pointermove',   this.#on_pan_pointer_move);
        this.#pan.addEventListener('pointerup',     this.#on_pan_pointer_up);
        this.#pan.addEventListener('pointercancel', this.#on_pan_pointer_cancel);
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x < 0) x = 0;
        if (x > this.#pan.clientWidth ) x = this.#pan.clientWidth;
        if (y < 0) y = 0;
        if (y > this.#pan.offsetHeight) y = this.#pan.offsetHeight;
        this.#pan_brief.style.left  = `${x}px`;
        this.#pan_brief.style.top   = `${y}px`;
        this.#handle_pan.style.left = `${x}px`;
        this.#handle_pan.style.top  = `${y}px`;
        this.#onColorChanged(x / this.#pan.clientWidth * 100, (1.0 - y / this.#pan.clientHeight) * 100);
    }

    /**
     * 
     * pan事件
     * 
     * @param {*} event 
     */
    #onPanPointerMove(event) {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x < 0) x = 0;
        if (x > this.#pan.clientWidth ) x = this.#pan.clientWidth;
        if (y < 0) y = 0;
        if (y > this.#pan.clientHeight) y = this.#pan.clientHeight;
        this.#pan_brief.style.left  = `${x}px`;
        this.#pan_brief.style.top   = `${y}px`;
        this.#handle_pan.style.left = `${x}px`;
        this.#handle_pan.style.top  = `${y}px`;
        this.#onColorChanged(x / this.#pan.clientWidth * 100, (1.0 - y / this.#pan.clientHeight) * 100);
    }
    
    /**
     * 
     * pan事件
     * 
     * @param {*} event 
     */
    #onPanPointerUp(event) {
        event.stopPropagation();
        if (event && event.pointerId) {
            this.#pan.releasePointerCapture(event.pointerId);
        }
        this.#pan_brief.style.visibility = 'hidden';
        this.#pan.removeEventListener('pointermove',   this.#on_pan_pointer_move);
        this.#pan.removeEventListener('pointercancel', this.#on_pan_pointer_up);
        this.#pan.removeEventListener('pointerup',     this.#on_pan_pointer_cancel);
    }

    /**
     * 
     * pan事件
     * 
     * @param {*} event 
     */
    #onPanPointerCancel(event) {
        event.stopPropagation();
        this.#onPanPointerUp();
    }

    /**
     * 安装Hue的事件回调
     */
    #setupHue() {
        this.#hue.addEventListener('pointerdown', this.#on_hue_pointer_down);
    }

    /**
     * 协助Pan的事件回调
     */
    #uninstallHue() {
        this.#hue.removeEventListener('pointerdown',   this.#on_hue_pointer_down);
        this.#hue.removeEventListener('pointermove',   this.#on_hue_pointer_move);
        this.#hue.removeEventListener('pointerup',     this.#on_hue_pointer_up);
        this.#hue.removeEventListener('pointercancel', this.#on_hue_pointer_cancel);
        
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onHuePointerDown(event) {
        event.stopPropagation();
        this.#hue.setPointerCapture(event.pointerId);
        this.#hue.addEventListener('pointermove',   this.#on_hue_pointer_move);
        this.#hue.addEventListener('pointerup',     this.#on_hue_pointer_up);
        this.#hue.addEventListener('pointercancel', this.#on_hue_pointer_cancel);
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        if (x < 0) x = 0;
        if (x > this.#hue.clientWidth ) x = this.#hue.clientWidth;
        this.#handle_hue.style.left = `${x}px`;
        this.#onHueChanged(x / this.#hue.clientWidth);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onHuePointerMove(event) {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        if (x < 0) x = 0;
        if (x > this.#hue.clientWidth ) x = this.#hue.clientWidth;
        this.#handle_hue.style.left = `${x}px`;
        this.#onHueChanged(x / this.#hue.clientWidth * 360);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onHuePointerUp(event) {
        event.stopPropagation();
        if (event && event.pointerId) {
            this.#hue.releasePointerCapture(event.pointerId);
        }
        this.#hue.removeEventListener('pointermove',   this.#on_hue_pointer_move);
        this.#hue.removeEventListener('pointerup',     this.#on_hue_pointer_up);
        this.#hue.removeEventListener('pointercancel', this.#on_hue_pointer_cancel);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onHuePointerCancel(event) {
        event.stopPropagation();
        this.#onHuePointerUp(event);
    }

    /**
     * 安装Alpha的事件回调
     */
    #setupAlpha() {
        this.#alpha_container.addEventListener('pointerdown', this.#on_alpha_pointer_down);
    }

    /**
     * 协助Alpha的事件回调
     */
    #uninstallAlpha() {
        this.#alpha_container.removeEventListener('pointerdown',   this.#on_alpha_pointer_down);
        this.#alpha_container.removeEventListener('pointermove',   this.#on_alpha_pointer_move);
        this.#alpha_container.removeEventListener('pointerup',     this.#on_alpha_pointer_up);
        this.#alpha_container.removeEventListener('pointercancel', this.#on_alpha_pointer_cancel);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onAlphaPointerDown(event) {
        event.stopPropagation();
        this.#alpha_container.setPointerCapture(event.pointerId);
        this.#alpha_container.addEventListener('pointermove',   this.#on_alpha_pointer_move);
        this.#alpha_container.addEventListener('pointerup',     this.#on_alpha_pointer_up);
        this.#alpha_container.addEventListener('pointercancel', this.#on_alpha_pointer_cancel);
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        if (x < 0) x = 0;
        if (x > this.#alpha_container.clientWidth ) x = this.#alpha_container.clientWidth;
        this.#handle_alp.style.left = `${x}px`;
        this.#onAlphaChanged(x / this.#alpha_container.clientWidth);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onAlphaPointerMove(event) {
        event.stopPropagation();
        const rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        if (x < 0) x = 0;
        if (x > this.#alpha_container.clientWidth ) x = this.#alpha_container.clientWidth;
        this.#handle_alp.style.left = `${x}px`;
        this.#onAlphaChanged(x / this.#alpha_container.clientWidth);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onAlphaPointerUp(event) {
        event.stopPropagation();
        if (event && event.pointerId) {
            this.#alpha_container.releasePointerCapture(event.pointerId);
        }
        this.#alpha_container.removeEventListener('pointermove',   this.#on_alpha_pointer_move);
        this.#alpha_container.removeEventListener('pointerup',     this.#on_alpha_pointer_up);
        this.#alpha_container.removeEventListener('pointercancel', this.#on_alpha_pointer_cancel);
    }

    /**
     * 
     * hue事件
     * 
     * @param {*} event 
     */
    #onAlphaPointerCancel(event) {
        event.stopPropagation();
        this.#onAlphaPointerUp(event);
    }

    /**
     * 
     * 更新 hex
     * 
     * @param {*} dispatch_event 
     */
    #updateHexColor(dispatch_event = true) {
        let rgb = Chroma.hsl(this.#h, this.#s / 100, this.#l / 100).rgb();
        if (isNaN(rgb[0])) rgb[0] = 0;
        if (isNaN(rgb[1])) rgb[1] = 0;
        if (isNaN(rgb[2])) rgb[2] = 0;
        this.#r.value = rgb[0];
        this.#g.value = rgb[1];
        this.#b.value = rgb[2];
        this.#hex_color = Chroma(rgb[0], rgb[1], rgb[2]).hex();
        this.#pan_brief.style.backgroundColor = this.#hex_color;

        // 发送事件
        if (dispatch_event) {
            this.dispatchUserDefineEvent('color-changed', {
                hex: this.hexColor,
                hexValue: this.hexValue,
            });
        }
    }

    /**
     * 更新 hue
     */
    #updateHue() {
        let rgb = Chroma.hsl(this.#h, 1, 0.5).rgb();
        if (isNaN(rgb[0])) rgb[0] = 0;
        if (isNaN(rgb[1])) rgb[1] = 0;
        if (isNaN(rgb[2])) rgb[2] = 0;
        let hex = Chroma(rgb[0], rgb[1], rgb[2]).hex();
        this.#pan.style.backgroundColor = hex;
        this.#color_gradient.style.backgroundImage = `linear-gradient(to right, ${hex}, transparent)`;
    }

    /**
     * 
     * HSV 转到 HSL , 颜色发生了变化
     * 
     * @param {*} s 饱和度
     * @param {*} v 亮度 
     */
    #onColorChanged(s, v) {
        this.#s = s * v / ((200 - s) * v / 100);
        this.#l = (200 - s) * v / 200;
        this.#updateHexColor();
    }

    /**
     * 
     * 色阶发生了变化
     * 
     * @param {Number} hue 
     */
    #onHueChanged(hue) {
        if (this.#h == hue) {
            return;
        }
        this.#h = hue;
        this.#updateHue();
        this.#updateHexColor();
    }

    /**
     * 
     * 透明度发生了变化
     * 
     * @param {Number} alpha 
     */
    #onAlphaChanged(alpha) {
        if (this.#a == alpha) {
            return;
        }
        this.#a = alpha;

        // 发送事件
        this.dispatchUserDefineEvent('alpha-changed', {
            alpha: alpha
        });
    }

    /**
     * 
     * 设置显示的alpha
     * 
     * @param {Number} alpha 
     */
    setPanAlpha(alpha) {
        if (alpha > 1) alpha = 1;
        if (alpha < 0) alpha = 0;
        if (this.#a != alpha) {
            this.#a = alpha;
            this.#handle_alp.style.left = `${alpha * 100}%`;
        }

        // 发送事件
        this.dispatchUserDefineEvent('alpha-changed', {
            alpha: alpha
        });
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setPanColorRGB(r, g, b) {
        // RGB转HSV
        let hsv = Chroma(r, g, b).hsv();
        let hsl = Chroma(r, g, b).hsl();

        // 调整
        this.#h = isNaN(hsl[0])? 0: hsl[0];
        this.#s = isNaN(hsl[1])? 0: hsl[1] * 100;
        this.#l = isNaN(hsl[2])? 0: hsl[2] * 100;
        this.#updateHue();
        this.#updateHexColor(false);

        // 调整 元素位置 的位置
        this.#handle_hue.style.left = `${this.#h / 360 * 100}%`;
        this.#handle_pan.style.left = `${hsv[1] * 100}%`;
        this.#handle_pan.style.top  = `${100 - hsv[2] * 100}%`;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setPanColor(color) {
        if (isNumber(color)) {
            let r = (color >> 16) & 0xFF;
            let g = (color >>  8) & 0xFF;
            let b = (color      ) & 0xFF;
            this.setPanColorRGB(r, g, b);
        } else if (isString(color)) {
            const rgb = Chroma(color).rgb();
            this.setPanColorRGB(rgb[0], rgb[1], rgb[2]);
        }
    }
}

CustomElementRegister(tagName, ColorSelector);
