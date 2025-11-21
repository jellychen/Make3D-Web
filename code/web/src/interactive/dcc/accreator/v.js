/* eslint-disable no-unused-vars */

import Axios                 from 'axios';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Content               from '@ux/base/content';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-arena';

/**
 * 根元素
 */
export default class Arena extends Content {
    /**
     * 元素
     */
    #container;
    #auth;
    #rest;
    #ms;
    #create;

    /**
     * 开通的月数
     */
    #months = 1;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#auth      = this.getChild('#auth');
        this.#rest      = this.getChild('#rest');
        this.#ms        = this.getChild('#ms');
        this.#create    = this.getChild('#create');
        this.#create.onclick = () => this.#onClickCreate();

        for (const child of this.#ms.children) {
            if (child.tag() != "x-text") {
                continue;
            }

            child.onclick = () => {
                for (const child of this.#ms.children) {
                    child.removeAttribute('selected');
                }
                child.setAttribute('selected', '');
                this.#months = parseInt(child.getData());
            };
        }
    }

    /**
     * 点击创建
     */
    #onClickCreate() {
        this.#rest.value = '';

        const auth = this.#auth.value;
        if (!auth) {
            this.#rest.value = 'auth empty';
            return;
        }

        Axios.get("https://api.make3d.online/v1/admin/create-vip-ticket", {
            params: {
                auth,
                months: this.#months,
            }
        }).then(response => {
            try {
                const data = response.data;
                if (data.success) {
                    this.#rest.value = data.content.ticket;
                } else {
                    this.#rest.value = data.error;
                }
            } catch(e) {
                this.#rest.value = "## Error ##";
            }
        }).catch(error => {
            console.error(error);
            this.#rest.value = error;
        });
    }
}

CustomElementRegister(tagName, Arena);
