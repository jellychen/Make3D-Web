/* eslint-disable no-unused-vars */

import LocalImageUrls        from '@common/misc/local-image-urls';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ToImageUrl            from '@core/misc/texture-to-image';
import ToImageUrlCenter      from '@core/misc/texture-to-image-lru-center';
import ShowImageViewer       from '@editor/arena/image-viewer';
import ShowConf              from './conf';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-editor-texture';

/**
 * 纹理尺寸
 */
const DEFAULT_IMAGE_W = 84;
const DEFAULT_IMAGE_H = 84;

/**
 * 调整纹理
 */
export default class MaterialEditorTexture extends Element {
    /**
     * 元素
     */
    #name;
    #btn_file;
    #input;
    #btn_remove_texture;
    #btn_conf_texture;
    #texture;
    #texture_preview;

    /**
     * threejs的texture
     */
    #three_texture;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 加载的URL 
     */
    #file_url;

    /**
     * 事件回调
     */
    #on_click_file   = event => this.#onClickFile(event);
    #on_file         = event => this.#onFile(event);
    #on_click_remove = event => this.#onClickRemoveTexture(event);
    #on_click_image  = event => this.#onClickImage(event);
    #on_click_conf   = event => this.#onClickConf(event);

    /**
     * 获取
     */
    get url() {
        return this.#file_url;
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
        this.#btn_conf_texture   = this.getChild('#setter');
        this.#input              = this.getChild('#file-input');
        this.#texture            = this.getChild('#texture');
        this.#texture_preview    = this.getChild('#texture-preview');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
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

        if ('name-token' == name) {
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

        // 事件
        this.#btn_file          .addEventListener('click' , this.#on_click_file);
        this.#btn_remove_texture.addEventListener('click' , this.#on_click_remove);
        this.#btn_conf_texture  .addEventListener('click' , this.#on_click_conf);
        this.#input             .addEventListener('change', this.#on_file);
        this.#texture_preview   .addEventListener('click' , this.#on_click_image);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
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
     * 设置显示的纹理
     * 
     * @param {*} texture 
     * @param {*} update_thumb 
     */
    setTexture(texture, update_thumb = true) {
        if (update_thumb) {
            const dpr = window.devicePixelRatio || 1.0;
            const w   = DEFAULT_IMAGE_W * dpr;
            const h   = DEFAULT_IMAGE_H * dpr;
            const url = ToImageUrlCenter.toImage(texture, w, h);
            this.#file_url = url;
            this.#texture.setUrl(url);
        }
        this.#three_texture = texture;
    }

    /**
     * 
     * 更新
     * 
     * @param {*} texture 
     */
    updateTexture(texture) {
        this.setTexture(texture, false);
    }

    /**
     * 
     * @param {*} texture 
     * @returns 
     */
    setValue(texture) {
        return this.setTexture(texture);
    }

    /**
     * 
     * 获取Image
     * 
     * @returns 
     */
    getFileUrl() {
        return this.#file_url;
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

        // 释放旧的
        if (this.#file_url) {
            LocalImageUrls.Default().remove(this.#file_url);
            this.#file_url = undefined;
        }

        // 构建新的
        this.#file_url = URL.createObjectURL(this.#input.files[0]);
        LocalImageUrls.Default().add(this.#file_url);
        this.#texture.setUrl(this.#file_url);

        // 清空
        this.#input.value = '';

        // 发送事件
        this.#onTextureChanged();
    }

    /**
     * 
     * 移除图片
     * 
     * @param {*} event 
     */
    #onClickRemoveTexture(event) {
        this.#texture.setUrl(undefined);
        if (this.#file_url) {
            this.disposeFileUrl();

            // 发送事件
            this.#onTextureChanged();
        }
    }

    /**
     * 
     * 配置
     * 
     * @param {*} event 
     */
    #onClickConf(event) {
        ShowConf(this.#three_texture, conf => {
            this.#onTextureChanged();
        }, this.#btn_conf_texture);
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

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickImage(event) {
        if (this.#three_texture && this.#three_texture.image) {
            const w = this.#three_texture.image.width;
            const h = this.#three_texture.image.height;
            if (w > 0 && h > 0) {
                ShowImageViewer(ToImageUrlCenter.toImage(this.#three_texture, w, h), this.#texture, 10);
            }
        }
    }

    /**
     * 销毁文件Url
     */
    disposeFileUrl() {
        if (this.#file_url) {
            LocalImageUrls.Default().remove(this.#file_url);
            this.#file_url = undefined;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.disposeFileUrl();
    }
}

CustomElementRegister(tagName, MaterialEditorTexture);
