/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Languages             from '@ux/i18n';
import DropSelector          from '@ux/controller/drop-selector';
import IntroducerConf        from '@core/introducer/configure';
import Receptacle            from './receptacle/v';
import Subscriber            from './subscriber/v';
import User                  from './user/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-container';

/**
 * 左侧的容器
 */
export default class SideMenuContainer extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #version;
    #btn_lang;
    #receptacle;

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
        this.#version    = this.getChild('#version');
        this.#btn_lang   = this.getChild('#lang');
        this.#receptacle = this.getChild('#receptacle');
        this.#btn_lang.addEventListener('click', event => this.onBtnLangClick(event));

        {
            const vh = __VERSION_H__;
            const vl = __VERSION_L__;
            this.#version.innerText = `v${vh}.${vl}`;
        }
    }
    
    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     * @returns 
     */
    setCoordinator(coordinator) {
        if (this.#coordinator) {
            throw new Error("coordinator is exists");
        }

        this.#coordinator = coordinator;
        this.#receptacle.setCoordinator(coordinator);
        this.#coordinator.addEventListener('mode-changed', () => this.#onEcModeChanged());
        this.#coordinator.addEventListener('rt-start',     () => this.#onEcModeChanged());
        this.#coordinator.addEventListener('rt-finish',    () => this.#onEcModeChanged());
        this.#onEcModeChanged(this.#coordinator.ecType());

        return this;
    }

    /**
     * 
     * 加载
     * 
     * @returns 
     */
    load() {
        return this;
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this.#btn_lang, "introducer.lang.switcher");
    }

    /**
     * EC模式变化
     */
    #onEcModeChanged() {
        const coordinator = this.#coordinator;
        const ec          = coordinator.ec;
        const ec_scene    = coordinator.isEcScene();
        if (!ec_scene) {
            this.#receptacle.setEnable(false);
        } else {
            const open_rt = ec.isOpenRTWindow();
            this.#receptacle.setEnable(ec_scene && !open_rt);
        }
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
            'right-end',
            'normal',
            10);
    }
}

CustomElementRegister(tagName, SideMenuContainer);
