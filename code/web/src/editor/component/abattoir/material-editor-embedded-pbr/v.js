/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DAO                   from './constants';
import Item                  from './v-item';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-editor-embedded-pbr';

/**
 * 内置的PBR材质
 */
export default class MaterialEditorEmbeddedPbr extends Element {
    /**
     * 元素
     */
    #scrollable_container_content;

    /**
     * 事件回调
     */
    #on_pointerdown = (event) => this.#onPointerdown(event);

    /**
     * 材质
     */
    #material;

    /**
     * 回调函数
     */
    #on_material_changed;

    /**
     * 
     * 构造函数
     * 
     * @param {*} material 
     * @param {*} on_material_changed 
     */
    constructor(material, on_material_changed) {
        super(tagName);
        this.#material = material;
        this.#on_material_changed = on_material_changed;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#scrollable_container_content = this.getChild('#scrollable-container-content');
        for (const i of DAO) {
            const item = new Item(i, attach => {
                if (isFunction(attach)) {
                    attach(this.#material);
                }

                if (isFunction(this.#on_material_changed)) {
                    this.#on_material_changed();
                }

                this.#dismiss();
            });
            this.#scrollable_container_content.appendChild(item);
        }
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_pointerdown);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_pointerdown);
    }

    /**
     * 
     * 鼠标点击
     * 
     * @param {*} event 
     * @returns 
     */
    #onPointerdown(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        this.style.pointerEvents = 'none';
        this.#dismiss();
    }

    /**
     * 点击其他地方 消失
     */
    #dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, MaterialEditorEmbeddedPbr);
