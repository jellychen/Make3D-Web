/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Languages             from '@ux/i18n';
import DropSelector          from '@ux/controller/drop-selector';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-header';

/**
 * 额头
 */
export default class Header extends Element {
    /**
     * 元素
     */
    #btn_lang;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#btn_lang = this.getChild('#lang');
        this.#btn_lang.addEventListener('click', event => this.onBtnLangClick(event));
    }

    /**
     * 
     * 点击更换语言的按钮
     * 
     * @param {*} event 
     */
    onBtnLangClick(event) {
        // 获取支持的语言列表
        const langs = Languages.getLangsList();

        // 获取当前的语言
        const current = Languages.getCurrentIndex();
        
        // 数据
        const _drop_selector_data_ = [];
        for (const item of langs) {
            _drop_selector_data_.push({
                token: item.index,
                text : item.name,
                selected: item.index === current,
            });
        }

        // 显示选择列表
        DropSelector(
            _drop_selector_data_,
            (token) => Languages.setCurrent(token),
            document.body,
            this.#btn_lang,
            'bottom',
            'normal',
            10);
    }
}

CustomElementRegister(tagName, Header);
