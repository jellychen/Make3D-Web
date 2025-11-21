/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DropSelector          from '@ux/controller/drop-selector';
import Checker               from './checker';
import Html                  from './v-mode-selector.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-mode-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 场景
    {
        icon: 'ui/mode-scene.svg',
        token: 'scene',
        text_token: "mode-selector.scene",
        enable: true,
    },

    // 修改器
    {
        icon: 'ui/mode-modifier.svg',
        token: 'modifier',
        text_token: "mode-selector.editor.briefness",
        enable: true,
    },

    // 编辑器
    {
        icon: 'ui/mode-topo-editor.svg',
        token: 'editor',
        text_token: "mode-selector.editor.solid",
        enable: true,
    },

    // 融并
    {
        icon: 'ui/merge.svg',
        token: 'merge',
        text_token: "mode-selector.editor.merge",
        enable: true,
    },

    // 管道
    {
        icon: 'ui/tube.svg',
        token: 'tube',
        text_token: "tube",
        enable: true,
    },

    // 布尔运算
    {
        icon: 'ui/mode-boolean.svg',
        token: 'boolean',
        text_token: "mode-selector.editor.boolean",
        enable: true,
    },

    // // 雕刻
    // {
    //     icon: 'ui/mode-sculptor.svg',
    //     token: 'sculptor',
    //     text_token: "mode-selector.editor.sculptor",
    //     enable: true,
    // },

    // 展UV
    {
        icon: 'ui/mode-uv.svg',
        token: 'uv',
        text_token: "mode-selector.editor.uv",
        enable: true,
    },

    // 模拟
    {
        icon: 'ui/mode-simulator.svg',
        token: 'simulator',
        text_token: "mode-selector.editor.simulator",
    },
];

/**
 * 模式选择器
 */
export default class NavModeSelector extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;
    #icon;
    #text;

    /**
     * 状态检测
     */
    #checker = new Checker();

    /**
     * 事件回调
     */
    #on_click = event => this.#onClick(event);

    /**
     * 当前模式
     */
    #current_mode;

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
        this.#container = this.getChild('#container');
        this.#icon = this.getChild('#icon');
        this.#text = this.getChild('#text');
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#checker.setCoordinator(coordinator);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#container.addEventListener('click', this.#on_click);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#container.removeEventListener('click', this.#on_click);
    }

    /**
     * 
     * 获取当前的编辑模式
     * 
     * @returns 
     */
    getCurrentMode() {
        return this.#current_mode;
    }

    /**
     * 设置场景模式
     */
    setModeScene() {
        this.setMode('scene');
    }

    /**
     * 
     * 设置模式
     * 
     * scene
     * modifier
     * editor
     * boolean
     * sculptor
     * uv
     * 
     * @param {string} token 
     */
    setMode(token) {
        // 过滤重复
        if (this.#current_mode === token) {
            return;
        }

        // 从 _drop_selector_data_ 找到对应的数据
        let item = undefined;
        for (const i of _drop_selector_data_) {
            if (i.token === token) {
                item = i;
                break;
            }
        }

        if (!item) {
            return false;
        }

        // 设置数据
        this.#text.setTokenKey(item.text_token);
        this.#icon.setSrc(item.icon);

        // 记录模式
        this.#current_mode = token;
    }

    /**
     * 
     * 点击事件
     * 
     * @param {*} event 
     */
    #onClick(event) {
        // 显示菜单
        for (const i of _drop_selector_data_) {
            i.enable = this.#checker.check(i.token);
        }

        DropSelector(
            _drop_selector_data_,
            token => this.#onModeSelected(token),
            this.#container,
            this.#container,
            'bottom-start',
            'normal',
            5);
        event.stopPropagation();
    }

    /**
     * 
     * 选择了Mode
     * 
     * @param {string} mode_token 
     */
    #onModeSelected(mode_token) {
        this.setMode(mode_token);
        this.dispatchEventDetail('mode-changed', mode_token);
    }
}

CustomElementRegister(tagName, NavModeSelector);
