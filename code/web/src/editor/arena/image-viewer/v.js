/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation';
import Moveable              from '@common/misc/moveable';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-image-viewer';

/**
 * 图片查看器
 */
export default class ImageViewer extends Element {
    /**
     * 容器
     */
    #container;

    /**
     * 标题
     */
    #title;
    #image;
    #download;
    #close;

    /**
     * token
     */
    #token;

    /**
     * 可移动
     */
    #moveable;

    /**
     * 事件回调
     */
    #on_move_begin          = event => this.#onMoveBegin(event);
    #on_move_finish         = event => this.#onMoveFinish(event);
    #on_window_size_changed = event => this.#onWindowSizeChange(event);

    /**
     * 获取
     */
    get content() {
        return this.#container;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(true);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#title     = this.getChild('#title-container');
        this.#image     = this.getChild('#image');
        this.#download  = this.getChild('#download');
        this.#close     = this.getChild('#close');
        this.#download.onclick = event => this.#onClickDownload(event);
        this.#close.onclick    = event => this.#onClickClose(event);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('resize', this.#on_window_size_changed);
        this.#moveable = new Moveable(this.#container, this);
        this.#moveable.addEventListener('move-begin', this.#on_move_begin);
        this.#moveable.addEventListener('move-finish', this.#on_move_finish);
        this.#moveable.attach();
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this.#on_window_size_changed);
        this.#moveable.detach();
    }

    /**
     * 
     * 开始拖动
     * 
     * @param {*} event 
     */
    #onMoveBegin(event) {
        this.#container.setAttribute('outline', "");
    }

    /**
     * 
     * 结束拖动
     * 
     * @param {*} event 
     */
    #onMoveFinish(event) {
        this.#container.removeAttribute('outline');
    }

    /**
     * 
     * 尺寸发生了变化
     * 
     * @param {*} event 
     */
    #onWindowSizeChange(event) {
        this.dispose();
    }

    /**
     * 
     * 点击下载
     * 
     * @param {*} event 
     */
    #onClickDownload(event) {
        let filename = this.#token;
        if (!isString(filename) || '' == filename) {
            filename = 'image.png';
        } else {
            filename = filename + '.png';
        }
        
        const link = document.createElement('a');
        link.href = this.#image.src;
        link.download = filename;
        link.click();
    }

    /**
     * 
     * 点击了关闭
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        this.dispose();
    }

    /**
     * 
     * 设置
     * 
     * @param {*} token 
     */
    setToken(token) {
        if (isString(token)) {
            this.#token = token;
        } else {
            this.#token = undefined;
        }
    }

    /**
     * 
     * 设置显示的图片
     * 
     * @param {*} image 
     */
    setImage(image) {
        if (isString(image)) {
            this.#image.src = image;
        } else {
            this.#image.src = '';
        }
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(
            this, 
            {
                opacity: 0,
                duration: 300,
                easing: 'easeOutCubic',
                onComplete: () => {
                    this.remove();
                }
            }
        );
    }
}

CustomElementRegister(tagName, ImageViewer);
