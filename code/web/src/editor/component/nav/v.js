/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation';
import KeyboardDoublePress   from '@common/misc/keyboard-double-press';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IntroducerConf        from '@core/introducer/configure';
import NavModeSelector       from './v-mode-selector';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav';

/**
 * 头部导航条
 */
export default class Nav extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 记录当前的mode
     */
    #mode;

    /**
     * 元素
     */
    #container;
    #mode_selector;
    #toolbar;
    #return_to_scene;

    /**
     * 导航内容
     */
    #toolbar_content;

    /**
     * 模态遮罩层
     */
    #modal_container;

    /**
     * 禁止遮罩
     */
    #mask;

    /**
     * 事件回调
     */
    #on_mode_changed = event => this.#onEditorModeChanged(event);
    #on_keyup        = event => this.#onKeyUp(event);

    /**
     * 按键双击检测
     */
    #keyboard_double_press = new KeyboardDoublePress();

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
        this.#container       = this.getChild('#container');
        this.#mode_selector   = this.getChild('#mode-selector');
        this.#return_to_scene = this.getChild('#return-to-scene');
        this.#toolbar         = this.getChild('#toolbar');
        this.#modal_container = this.getChild('#modal-container');
        this.#mask            = this.getChild('#mask');
        this.#return_to_scene.addEventListener('click', event => this.#onClickReturnToScene(event));
        this.#mode_selector.addEventListener('mode-changed', this.#on_mode_changed);
        this.#keyboard_double_press.addEventListener('double-press', event => this.#onKeyDoublePress(event));
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#mode_selector.setCoordinator(coordinator);
        return this;
    }

    /**
     * 执行加载
     */
    load() {
        const canvas = this.#coordinator.abattoir.canvas;
        if (canvas) {
            canvas.addEventListener("keyup", this.#on_keyup);
        }
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
        IntroducerConf.add(this.#mode_selector, "introducer.mode.selector");
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#coordinator) {
            const canvas = this.#coordinator.abattoir.canvas;
            if (canvas) {
                canvas.removeEventListener("keyup", this.#on_keyup);
            }
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} forbidden 
     */
    setForbidden(forbidden) {
        if (forbidden) {
            this.#container.setAttribute('transparent', true);
            this.#mask.style.display = 'block';
        } else {
            this.#container.removeAttribute('transparent');
            this.#mask.style.display = 'none';
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} enable 
     */
    setEnable(enable) {
        if (enable) {
            this.#container.style.opacity = 1;
            this.#mask.style.display      = 'none';
        } else {
            this.#container.style.opacity = 0.4;
            this.#mask.style.display      = 'block';
        }
    }

    /**
     * 
     * 获取Toolbar
     * 
     * @returns 
     */
    getToolbarContent() {
        return this.#toolbar_content;
    }

    /**
     * 
     * 设置 Toolbar 的内容
     * 
     * @param {*} content 
     */
    setToolbarContent(content) {
        // 记录
        this.#toolbar_content = content;

        // 移除 toolbar 容器的所有孩子
        let children = this.#toolbar.childNodes;
        while (children.length > 0) {
            children[0].remove();
        }
        
        // 添加新的元素
        if (content) {
            this.#toolbar.appendChild(content);

            //
            // 执行动画
            // 防止卡主当前帧
            //
            this.nextFrameTick(() => {
                content.style.opacity = 0;
                Animation.FadeIn(content);
            });
        }
    }

    /**
     * 
     * 获取模态遮罩
     * 
     * @returns 
     */
    getModalContainer() {
        return this.#modal_container;
    }

    /**
     * 
     * 设置模态遮罩的显示隐藏
     * 
     * @param {boolean} show 
     */
    showModalContaienr(show) {
        if (true === show) {
            this.#modal_container.style.display = 'block';
        } else {
            this.#modal_container.style.display = 'none';
        }
    }

    /**
     * 设置场景模式
     */
    setEditorModeDefault() {
        this.setEditorMode('scene');
    }

    /**
     * 
     * 设置编辑的模式
     * 
     * @param {string} mode 
     */
    setEditorMode(mode) {
        if (!isString(mode)) {
            return;
        }

        if (this.#mode === mode) {
            return;
        } else {
            this.#mode = mode;
        }

        if ('scene' === this.#mode) {
            this.#return_to_scene.style.display = 'none';
        } else {
            this.#return_to_scene.style.display = 'block';
        }

        this.#mode_selector.setMode(mode);
        this.#coordinator.setEditorMode(mode);
    }

    /**
     * 
     * 编辑模式
     * 
     * @param {Event} event 
     */
    #onEditorModeChanged(event) {
        this.#coordinator.setEditorMode(event.detail);
    }

    /**
     * 点击返回场景
     */
    #onClickReturnToScene(event) {
        this.setEditorModeDefault();
    }

    /**
     * 
     * 按键
     * 
     * @param {*} event 
     */
    #onKeyUp(event) {
        this.#keyboard_double_press.check(event.key);
    }

    /**
     * 
     * 双击
     * 
     * @param {*} event 
     */
    #onKeyDoublePress(event) {
        switch (event.key) {
        case 'Escape':
            this.setEditorModeDefault();
            break;

        case 'Enter':
            this.setEditorMode('editor');
            break;
        }
    }
}

CustomElementRegister(tagName, Nav);
