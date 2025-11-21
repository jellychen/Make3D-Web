/* eslint-disable no-unused-vars */

import AbsoluteLocation      from '@common/misc/absolute-location';
import Moveable              from '@common/misc/moveable';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-cabinet';

/**
 * 当前的order
 */
let zorder = 0;

/**
 * 最大尺寸
 */
const max_w = 320;
const max_h = 320;

/**
 * 橱窗，显示样品的图片
 */
export default class Cabinet extends Element {
    /**
     * 元素
     */
    #container;
    #header;
    #content;
    #uploader;
    #close;

    /**
     * 显示的img
     */
    #img;

    /**
     * 可移动
     */
    #moveable;

    /**
     * 事件回调
     */
    #on_move_begin  = () => this.#onMoveBegin ();
    #on_move_finish = () => this.#onMoveFinish();

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
        this.#header        = this.getChild('#header');
        this.#content       = this.getChild('#content');
        this.#close         = this.getChild('#close');
        this.#uploader      = this.getChild('#uploader');
        this.onpointerdown  = event => this.#onPointerDown(event);
        this.#close.onclick = event => this.#onClickClose (event);
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
            this.#content.addEventListener(name, event => {
                event.preventDefault ();
                event.stopPropagation();
            }, false);
        });
        this.#content.addEventListener('drop', event => {
            const dt    = event.dataTransfer;
            const files = dt.files;
            this.#handleFiles(files);
        });
    }

    /**
     * 元素添加到DOM上面的回调
     */
    connectedCallback() {
        super.connectedCallback();
        AbsoluteLocation.Center(this, this.parentNode);
        this.#moveable = new Moveable(this, this.parentNode, this.#header);
        this.#moveable.addEventListener('move-begin', this.#on_move_begin);
        this.#moveable.addEventListener('move-finish', this.#on_move_finish);
        this.#moveable.attach();
    }

    /**
     * 元素从Dom上面移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#moveable.detach();
    }

    /**
     * 
     * 点击自己
     * 
     * @param {*} event 
     */
    #onPointerDown(event) {
        this.#bringToTopMost();
    }

    /**
     * 
     * 点击关闭
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        this.dismiss();
    }

    /**
     * 拿到最顶端
     */
    #bringToTopMost() {
        this.style.zIndex = ++zorder + 1000000;
    }

    /**
     * 窗体被拖动开始
     */
    #onMoveBegin() {
        this.#bringToTopMost();
    }

    /**
     * 窗体被拖动结束
     */
    #onMoveFinish() {
        ;
    }

    /**
     * 
     * 处理文件
     * 
     * @param {*} files 
     */
    #handleFiles(files) {
        if (!files || files.length === 0) {
            return;
        }

        const reader = new FileReader();
        reader.onload = event => {
            this.#uploader.remove();
            const img = document.createElement('img');
            img.src = event.target.result;
            const image_data = new Image();
            image_data.onload = () => {
                const w = image_data.width;
                const h = image_data.height;
                const r = Math.min(max_w / w, max_h / h, 1);
                img.width  = w * r;
                img.height = h * r;
                
                if (this.#img) {
                    this.#img.remove();
                }
                this.#img = img;
                this.#content.appendChild(img);
            }
            image_data.src = event.target.result;
        };
        reader.readAsDataURL(files[0]);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent) {
        parent = parent || document.body;
        parent.appendChild(this);
        this.#bringToTopMost();
    }

    /**
     * 消失
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Cabinet);