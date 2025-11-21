/* eslint-disable no-unused-vars */

import isNumber              from 'lodash/isNumber';
import AlertBox              from '@ux/controller/alert-box'
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Content               from '@ux/base/content';
import Coordinator           from '../coordinator';
import                            '../component';
import UserAvatar            from './user/avatar/v';
import UserInfo              from './user/info/v';
import Faq                   from './faq/v';
import Subscriber            from './subscriber/v';
import Toasts                from './toasts/v';
import Performance           from './performance/v';
import ShortCut              from './shortcut/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-arena';

/**
 * 根元素
 */
export default class Arena extends Content {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 页面元素
     */
    #container;
    #container_dashboard;
    #mailbox_t;
    #mailbox_b;

    /**
     * toasts
     */
    #toasts;

    /**
     * 菜单
     */
    #nav;
    #side_menu;

    /**
     * 核心 abattoir
     */
    #abattoir;

    /**
     * 右侧调节面板
     */
    #moderator;

    /**
     * 页面辅助的面板
     */
    #performance;

    /**
     * 快捷键
     */
    #shortcut;

    /**
     * 键盘事件
     */
    #on_event_keydown = event => this.#onEventKeyDown(event);
    #on_event_keyup   = event => this.#onEventKeyUp  (event);

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get abattoir() {
        return this.#abattoir;
    }
    
    /**
     * 构造函数
     * 
     * @param {*} tagName 
     */
    constructor(tagName) {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();

        // 获取页面元素 
        this.#container           = this.getChild('#container');  // 核心容器
        this.#container_dashboard = this.getChild('#dashboard');  // 左侧核心容器
        this.#mailbox_t           = this.getChild('#mailbox-t');  // 顶部
        this.#mailbox_b           = this.getChild('#mailbox-b');  // 底部
        this.#abattoir            = this.getChild('#abattoir' );  // 核心展示
        this.#moderator           = this.getChild('#moderator');  // 右侧调节面板
        this.#nav                 = this.getChild('#nav');        // 头部导航
        this.#side_menu           = this.getChild('#side-menu');  // 侧边菜单        
    }

    /**
     * 初始化
     */
    async init() {
        // 初始化
        await this.#abattoir.init();

        // 启动协调器
        this.#coordinator = new Coordinator({
            arena       : this,
            dashboard   : this.#container_dashboard,
            nav         : this.#nav,
            side_menu   : this.#side_menu,
            abattoir    : this.#abattoir,
            moderator   : this.#moderator,
            mailbox_t   : this.#mailbox_t,
            mailbox_b   : this.#mailbox_b,
        });

        // 传入协调器
        this.#nav      .setCoordinator(this.#coordinator).load();
        this.#abattoir .setCoordinator(this.#coordinator).load();
        this.#moderator.setCoordinator(this.#coordinator).load();
        this.#side_menu.setCoordinator(this.#coordinator).load();

        // 添加默认的元素
        this.#coordinator.addDefaultElementsToScene();

        // 启动
        this.#coordinator.start();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.#on_event_keydown);
        document.addEventListener('keyup',   this.#on_event_keyup);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.#on_event_keydown);
        document.removeEventListener('keyup',   this.#on_event_keyup);
    }

    /**
     * 
     * 显示值
     * 
     * @param {*} token 
     * @param {*} defer_dismiss_timeout 
     */
    showToasts(token, defer_dismiss_timeout) {
        if (this.#toasts) {
            this.#toasts.remove();
            this.#toasts = undefined;
        }

        this.#toasts = new Toasts();
        this.#toasts.setToken(token);
        this.#toasts.on_dismiss = () => this.#toasts = undefined;
        this.#container_dashboard.appendChild(this.#toasts);
        if (isNumber(defer_dismiss_timeout) && defer_dismiss_timeout > 0) {
            this.#toasts.deferDismiss(defer_dismiss_timeout);
        }
    }

    /**
     * 
     * 插入到指定的节点中
     * 
     * @param {*} parent_node 
     */
    appendToParentNode(parent_node) {
        parent_node.appendChild(this);
    }

    /**
     * 
     * 打开或者关闭性能调试面板
     * 
     * @param {Boolean} enable 
     */
    setEnableDevToolsPerformance(enable) {
        if (enable) {
            if (this.#performance) {
                return;
            }
            this.#performance = new Performance();
            this.#container.appendChild(this.#performance);
        } else if (this.#performance) {
            this.#performance.remove();
            this.#performance = undefined;
        }
    }

    /**
     * 
     * 接收到需要右击菜单
     * 
     * @param {*} event 
     * @returns 
     */
    onCustomizeMenu(event) {
        event.stopPropagation();
        return true;
    }

    /**
     * 
     * 键盘按下事件
     * 
     * @param {*} event 
     */
    #onEventKeyDown(event) {
        //
        // Ctrl z + Meta z
        // 回撤
        //
        if (this.#coordinator) {
            const command_key = event.ctrlKey || event.metaKey && !event.repeat;
            if (event.key && event.key === 'z' && command_key) {
                this.#coordinator.rollback();
            }
        }

        // 显示帮助文档
        // if (event.key && 'q' === event.key && !this.#shortcut) {
        //     this.#shortcut = new ShortCut();
        //     this.#shortcut.show(true);
        // }
    }

    /**
     * 
     * 键盘弹起事件
     * 
     * @param {*} event 
     */
    #onEventKeyUp(event) {
        // 关闭帮助文档
        // if (event.key && 'q' === event.key && this.#shortcut) {
        //     this.#shortcut.dismiss();
        //     this.#shortcut = undefined;
        // }

        
    }
}

CustomElementRegister(tagName, Arena);
