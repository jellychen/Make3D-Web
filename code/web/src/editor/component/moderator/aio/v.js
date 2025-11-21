/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Toolbar               from './vertical-toolbar/v';
import SceneCard             from './cards/scene/v';
import PropertiesCard        from './cards/properties/v';
import MaterialCard          from './cards/material/v';
import AnimationCard         from './cards/animation/v';
import LightCard             from './cards/light/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-aio';

/**
 * AIO
 * 
 * 处简单问题来考虑，目前只在scene场景中展示
 * 
 */
export default class Aio extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 遮罩
     */
    #mask;

    /**
     * 元素
     */
    #toolbar;
    #content;
    #modal_container;

    /**
     * 卡片
     */
    #card_type = "";
    #card;

    /**
     * 事件回调
     */
    #on_toolbar_changed     = event => this.#onToolbarChanged(event);
    #on_editor_mode_changed = mode  => this.#onEditorModeChanged(mode);

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get card() {
        return this.#card;
    }

    /**
     * 获取
     */
    get modal() {
        return this.#modal_container;
    }

    /**
     * 获取内容
     */
    get content() {
        return this.#content;
    }

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
        this.#mask            = this.getChild('#mask');
        this.#toolbar         = this.getChild('#toolbar');
        this.#content         = this.getChild('#content');
        this.#modal_container = this.getChild('#modal-container');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#toolbar.addEventListener('changed', this.#on_toolbar_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#toolbar.removeEventListener('changed', this.#on_toolbar_changed);
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        if (this.#coordinator) {
            throw new Error("coordinator is exist");
        }
        this.#coordinator = coordinator;
    }

    /**
     * 执行加载
     */
    load() {
        this.setContent('scene', false);
        this.#toolbar.scene.setSelected(true);
        this.#coordinator.addEventListener('mode-changed', this.#on_editor_mode_changed);
    }

    /**
     * 
     * 根据字符串获取模块
     * 
     * @param {*} name 
     */
    getModule(name) {
        if (name === this.#card_type) {
            return this.#card;
        }
    }

    /**
     * 
     * 显示遮罩
     * 
     * @param {*} show 
     */
    showMask(show) {
        if (show) {
            this.#mask.style.display = 'block';
        } else {
            this.#mask.style.display = 'none';
        }
    }

    /**
     * 
     * 设置编辑的内容
     * 
     * @param {*} token 
     * @param {*} save_historical 
     * @returns 
     */
    setContent(token, save_historical = true) {
        if (this.#card_type === token) {
            return;
        }

        // 记录日志
        if (save_historical && this.#coordinator.isEcScene()) {
            const recoder = this.#coordinator.getHistoricalRecorder();
            if (recoder) {
                recoder.append({
                    scope: this,
                    token: this.#card_type,
                    rollback() {
                        this.scope.setContent(this.token, false);
                        this.scope.#toolbar.setSelect(this.token);
                    }
                });
            }
        }

        // 销毁     
        if (this.#card) {
            if (isFunction(this.#card.dispose)) {
                this.#card.dispose();
            }
            this.#card.remove();
            this.#card = undefined;
        }

        // 插入新的Card
        this.#card_type = token;

        if ("scene" === token) {
            this.#card = new SceneCard(this.#coordinator);
            this.#content.appendChild(this.#card);
        } else if ("properties" === token) {
            this.#card = new PropertiesCard(this.#coordinator);
            this.#content.appendChild(this.#card);
        } else if ("material" === token) {
            this.#card = new MaterialCard(this.#coordinator);
            this.#content.appendChild(this.#card);
        } else if ("animation" == token) {
            this.#card = new AnimationCard(this.#coordinator);
            this.#content.appendChild(this.#card);
        } else if ("light" == token) {
            this.#card = new LightCard(this.#coordinator);
            this.#content.appendChild(this.#card);
        }
    }

    /**
     * 
     * 显示中间的浮层
     * 
     * @param {boolean} show 
     */
    setShowModalContainer(show) {
        if (show) {
            this.#toolbar.style.display         = 'none';
            this.#content.style.display         = 'none';
            this.#modal_container.style.display = 'block';
        } else {
            this.#toolbar.style.display         = 'flex';
            this.#content.style.display         = 'flex';
            this.#modal_container.style.display = 'none';
        }
    }

    /**
     * 清理
     */
    clearModalContainer() {
        let children = this.#modal_container.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            this.#modal_container.removeChild(children[i]);
        }
    }

    /**
     * 
     * Toolbar 发生变化
     * 
     * @param {*} event 
     */
    #onToolbarChanged(event) {
        this.setContent(event.token);
    }

    /**
     * 
     * 当编辑模式发生变化
     * 
     * @param {*} mode 
     */
    #onEditorModeChanged(mode) {
        if ('scene' === mode) {
            this.showMask(false);
        } else {
            this.showMask(true);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#toolbar.removeEventListener('changed', this.#on_toolbar_changed);
        this.#coordinator.removeEventListener('mode-changed', this.#on_editor_mode_changed);
    }
}

CustomElementRegister(tagName, Aio);
