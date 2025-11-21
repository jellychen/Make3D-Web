/* eslint-disable no-unused-vars */

import AbsoluteLocation      from '@common/misc/absolute-location';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowConfirmation      from '@ux/controller/confirmation';
import ShowDroppersReceiver  from '@editor/arena/droppers-receiver';
import ModelUser             from '@editor/dao/model/user';
import ShowLogin             from '@editor/arena/login';
import OpenExport            from '@editor/arena/export';
import OpenAboutUS           from '@editor/component/misc/about-us';
import IntroducerConf        from '@core/introducer/configure';
import ShowSubscriber        from '../subscriber/v-subscriber';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-container-receptacle';

/**
 * 侧边容器
 */
export default class Receptacle extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;     // 容器
    #import;        // 导入文件
    #export;        // 导出
    #upgrad;        // 升级VIP
    #exit;          // 退出账号
    #community;     // 社区
    #tutorials;     // 文档
    #aboutus;       // 关于我们

    /**
     * 元素
     */
    #mask;

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
        this.#container = this.getChild('#container');
        this.#import    = this.getChild('#import');
        this.#export    = this.getChild('#export');
        this.#upgrad    = this.getChild('#upgrad');
        this.#exit      = this.getChild('#exit');
        this.#tutorials = this.getChild('#tutorials');
        this.#aboutus   = this.getChild('#aboutus');
        this.#mask      = this.getChild('#mask');
        this.#import    .onclick = () => this.#onClick_Import();;
        this.#export    .onclick = () => this.#onClick_Export();
        this.#upgrad    .onclick = () => this.#onClick_Upgrad();
        this.#exit      .onclick = () => this.#onClick_Exit();
        this.#tutorials .onclick = () => this.#onClick_Tutorials();
        this.#aboutus   .onclick = () => this.#onClick_Aboutus();
    }

    /**
     * 当UI首次添加到DOM执行动画
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this.#import, "introducer.import");
        IntroducerConf.add(this.#export, "introducer.export");
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     * @returns 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        return this;
    }

    /**
     * 
     * 设置是否可用
     * 
     * @param {*} enable 
     */
    setEnable(enable) {
        if (enable) {
            this.#container.style.opacity = 1;
            this.#mask.style.display      = 'none';
        } else {
            this.#container.style.opacity = 0.3;
            this.#mask.style.display      = 'block';
        }
    }

    /**
     * 点击
     */
    #onClick_Import() {
        ShowDroppersReceiver(this.#coordinator, this.#import);
    }

    /**
     * 点击
     */
    #onClick_Export() {
        OpenExport(this.#coordinator);
    }

    /**
     * 点击
     */
    #onClick_Upgrad() {
        ShowSubscriber(this.#upgrad, 'right-start');
    }

    /**
     * 点击
     */
    #onClick_Exit() {
        if (ModelUser.authed) {
            ShowConfirmation(
                this.#exit, 
                undefined, 
                'bottom-start', 
                'black',
                cancel_or_confirm => {
                    if (cancel_or_confirm) {
                        ShowLogin();
                        ModelUser.SignOut();
                    }
                },
                undefined,
                'logout.confirmation');
        }
    }

    /**
     * 点击
     */
    #onClick_Tutorials() {
        window.open('//doc.make3d.online', '_blank');
    }

    /**
     * 点击
     */
    #onClick_Aboutus() {
        const about = OpenAboutUS();
        if (about) {
            AbsoluteLocation.Center(about,  about.parentNode);
        }
    }
}

CustomElementRegister(tagName, Receptacle);
