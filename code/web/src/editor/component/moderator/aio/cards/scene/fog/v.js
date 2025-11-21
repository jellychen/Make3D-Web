/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ColorSelectorPanel    from '@ux/controller/color-selector-panel/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-fog';

/**
 * 调整雾
 */
export default class Fog extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 实时渲染器
     */
    #cinderella;

    /**
     * 元素
     */
    #switcher;
    #color;
    #slider;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        super.createContentFromTpl(tpl)
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher = this.getChild('#switcher');
        this.#color    = this.getChild('#color');
        this.#slider   = this.getChild('#slider');
        this.#color.addEventListener('click', event => this.#onClickColor(event));
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#cinderella = this.#coordinator.cinderella;
    }

    /**
     * 执行加载
     */
    load() {
        if (!this.#cinderella) {
            return;
        }

        const scene = this.#cinderella.getScene();
        if (!(scene instanceof XThree.Scene)) {
            return;
        }
        
        const fog = scene.fog;
        if (!(fog instanceof XThree.FogExp2)) {
            this.#switcher.checked = false;
            return;
        }

        const color = fog.color;
        const density = fog.density;
    }

    /**
     * 更新
     */
    update() {
        
    }

    /**
     * 
     * 点击颜色
     * 
     * @param {*} event 
     */
    #onClickColor(event) {
        this.nextFrameTick(() => {
            const panel = new ColorSelectorPanel();
            panel.setEnableAlpha(false);
            panel.showCloseBtn(false);
            panel.setDimissIfBlur(true);
            panel.place(this.#color, "auto");
            panel.setColor(this.#color);
            panel.addEventListener('color-changed', (event) => {
                this.#color.setColor(event.hexValue);
            });
            document.body.appendChild(panel); 
        });
    }
}

CustomElementRegister(tagName, Fog);
