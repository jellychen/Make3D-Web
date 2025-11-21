/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-editor-texture-conf';

/**
 * 纹理配置
 */
export default class TextureConf extends Element {
    /**
     * 纹理
     */
    #texture;

    /**
     * 元素
     */
    #flip_y;
    #srgb_linear;
    #srgb_linear_selected;
    #srgb;
    #srgb_selected;

    /**
     * color space
     */
    #color_space = '';

    /**
     * 回调函数
     */
    #on_changed;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

    /**
     * 获取
     */
    get texture() {
        return this.#texture;
    }

    /**
     * 获取
     */
    get color_space() {
        return this.#color_space;
    }

    /**
     * 是否
     */
    get flip_y() {
        return this.#flip_y.checked;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} texture 
     * @param {*} on_changed 
     */
    constructor(texture, on_changed) {
        super(tagName);
        this.#texture = texture;
        this.#on_changed = on_changed;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#flip_y               = this.getChild('#flip-y');
        this.#srgb_linear_selected = this.getChild('#srgb-linear-selected');
        this.#srgb_selected        = this.getChild('#srgb-selected');
        this.#srgb_linear          = this.getChild('#srgb-linear');
        this.#srgb                 = this.getChild('#srgb');
        this.#srgb_linear.onclick  = event => this.#onClickSRgbLinearSelected(event);
        this.#srgb.onclick         = event => this.#onClickSRgbSelected(event);
        this.#flip_y.onchanged     = event => this.#onFlipYChange(event);

        this.#flip_y.checked                            = this.texture.flipY;
        this.#srgb_linear_selected.style.visibility     = 'hidden';
        this.#srgb_selected.style.visibility            = 'hidden';
        if (this.texture.colorSpace                     === 'srgb') {
            this.#srgb_selected.style.visibility        = 'visible';
        } else if (this.texture.colorSpace              === 'srgb-linear') {
            this.#srgb_linear_selected.style.visibility = 'visible';
        }
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickSRgbSelected(event) {
        if (this.#color_space != 'srgb') {
            this.#srgb_linear_selected.style.visibility = 'hidden';
            this.#srgb_selected.style.visibility        = 'visible';
            this.#color_space = 'srgb';
            this.#texture.colorSpace = this.#color_space;
            this.#onConfChange();
        }
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickSRgbLinearSelected(event) {
        if (this.#color_space != 'srgb-linear') {
            this.#srgb_linear_selected.style.visibility = 'visible';
            this.#srgb_selected.style.visibility        = 'hidden';
            this.#color_space = 'srgb-linear';
            this.#texture.colorSpace = this.#color_space;
            this.#onConfChange();
        }
    }

    /**
     * 
     * 回掉
     * 
     * @param {*} event 
     */
    #onFlipYChange(event) {
        this.#texture.flipY = this.flip_y;
        this.#onConfChange();
    }

    /**
     * 配置发生了变化
     */
    #onConfChange() {
        if (isFunction(this.#on_changed)) {
            this.#on_changed(this);
        }
    }

    /**
     * 
     * 销毁
     * 
     * @returns 
     */
    dismiss() {
        Animation.Remove(this);
        return this;
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.dismiss();
    }
}

CustomElementRegister(tagName, TextureConf);
