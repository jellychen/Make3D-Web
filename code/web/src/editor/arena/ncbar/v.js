/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowMenu              from './v-menu';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ncbar';

/**
 * NCBar
 */
export default class NCBar extends Element {
    /**
     * 元素
     */
    #more;

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
        this.#more = this.getChild('#menu');
        this.#more.onclick = () => this.#onClickMoreMenu();
    }

    /**
     * 点击了更多的按钮
     */
    #onClickMoreMenu() {
        ShowMenu(this.#more, token => {
            switch(token) {

                //
                // 打开新的编辑器窗口
                //
            case 'start-new-editor':
                try {
                    window.__doever__.start_new_editor();
                } catch(e) {
                    console.error(e);
                }
                break;
            }
        });
    }
}

CustomElementRegister(tagName, NCBar);
