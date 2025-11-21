/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isInteger             from 'lodash/isInteger';
import isFunction            from 'lodash/isFunction';
import Fireworks             from '@common/misc/fireworks';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Alert                 from '@ux/controller/alert-box';
import API                   from '@editor/dao/api';
import ModelUser             from '@editor/dao/model/user';
import AccodeChecker         from './v-accode-checker';
import Congratulation        from './v-congratulation';
import Html                  from './v-accode-verify-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-subscriber-accode';

/**
 * 校验激活码
 */
export default class AccodeVerity extends Element {
    /**
     * 元素
     */
    #container;
    #input;
    #btn_active;
    #checker;

    /**
     * 事件
     */
    on_finish;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#container  = this.getChild('#container');
        this.#input      = this.getChild('#input');
        this.#btn_active = this.getChild('#active');
        this.#checker    = this.getChild('#checker');
        this.#btn_active.onclick = async () => await (this.#onClickActive());
    }

    /**
     * 点击了激活按钮
     */
    async #onClickActive() {
        const value = this.#input.value.trim();
        if (!isString(value)) {
            return;
        }

        // 显示加载
        this.#showChecker(true);

        // 发送请求
        const status = await API.vip.subscribeTicket(ModelUser.uid, value);
        if (isInteger(status) && status == 0) {

            // 刷新
            await ModelUser.RefreshVip();
            
            // 放一个烟花
            Fireworks.SchoolPride();

            // 弹出VIP框
            setTimeout(() => Congratulation.show(), 800);
            
        } else {
            Alert({
                icon              : 'info',
                text_content_token: 'accode.verify.fail',
            });
        }

        // 结束
        if (isFunction(this.on_finish)) {
            this.on_finish();
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} show 
     */
    #showChecker(show) {
        if (!show) {
            this.#checker.setAttribute('hidden', 'true');
        } else {
            this.#checker.removeAttribute('hidden');
        }
    }
}

CustomElementRegister(tagName, AccodeVerity);
