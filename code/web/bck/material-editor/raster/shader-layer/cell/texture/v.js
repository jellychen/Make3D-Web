/* eslint-disable no-unused-vars */

import LocalImageUrls        from '@common/misc/local-image-urls';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-texture';

/**
 * 纹理尺寸
 */
const DEFAULT_IMAGE_W = 84;
const DEFAULT_IMAGE_H = 84;

/**
 * 
 * 纹理
 * 
 * 用来转变成Threejs的Texture
 * 
 */
export default class Texture extends Element {
    /**
     * 元素
     */
    #name;
    #btn_file;
    #input;
    #btn_remove_texture;
    #texture;
    #texture_preview;

    /**
     * 
     * threejs的texture
     * 
     * 出于设计考虑，这里引用计数会增加 1
     * 
     */
    #texture_data;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 加载的URL, 需要主动释放
     */
    #file_url;

    /**
     * 获取
     */
    get texture() {
        return this.#texture_data;
    }

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
        this.#name               = this.getChild('#name');
        this.#btn_file           = this.getChild('#file');
        this.#btn_remove_texture = this.getChild('#remove');
        this.#input              = this.getChild('#file-input');
        this.#texture            = this.getChild('#texture');
        this.#texture_preview    = this.getChild('#texture-preview');
        this.#btn_file.onclick           = event => this.#onClickFile(event);
        this.#btn_remove_texture.onclick = event => this.#onClickRemoveTexture(event);
        this.#input.onchange             = event => this.#onFile(event);

    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name",
                "name-token",
                "token",
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

        if ('name' == name) {
            this.setName(_new);
        } else if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('token' == name) {
            this.#token = _new;
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#texture.setUrl(undefined);

        // 销毁内存URL
        if (this.#file_url) {
            LocalImageUrls.Default().remove(this.#file_url);
            this.#file_url = undefined;
        }

        // 销毁threejs texture 数据

    }

    /**
     * 
     * 设置
     * 
     * @param {*} name 
     */
    setName(name) {
        this.#name.setRaw(name);
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        this.#name.setToken(token);
    }

    /**
     * 
     * 点击文件按钮
     * 
     * @param {*} event 
     */
    #onClickFile(event) {
        this.#input.click();
    }

    /**
     * 
     * 文件选择器
     * 
     * @param {*} event 
     */
    #onFile(event) {
        if (!this.#input.files || this.#input.files.length == 0) {
            return;
        }
    }

    /**
     * 移除图片
     */
    #onClickRemoveTexture(event) {
    }

    /**
     * 图片发生变化
     */
    #onTextureChanged() {
        this.bubblesEvent({
            token: this.#token,
            element: this,
        });
    }
}

CustomElementRegister(tagName, Texture);
