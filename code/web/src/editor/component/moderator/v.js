/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Resizer               from '@ux/base/element-resizer';
import XPath                 from './xpath';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator';

/**
 * 右侧的容器
 */
export default class Moderator extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #container;

    /**
     * 监控尺寸变化
     */
    #resize;
    #landscape_resizer;

    /**
     * scene
     */
    #scene_container;
    #scene_container_resize;
    #scene_container_vertical_resizer;
    #scene_container_modal;

    /**
     * 元素
     */
    #scene;
    #scene_tree;
    #aio;
    #forbidden_mask;

    /**
     * xpath
     */
    #xpath = new XPath(this);

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 获取
     */
    get xpath() {
        return this.#xpath;
    }

    /**
     * 获取
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 获取
     */
    get scene_tree() {
        return this.#scene_tree;
    }

    /**
     * 获取
     */
    get aio() {
        return this.#aio;
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
        this.#container              = this.getChild('#container');
        this.#resize                 = this.getChild('#resize');
        this.#scene                  = this.getChild('#scene');
        this.#aio                    = this.getChild('#aio');
        this.#forbidden_mask         = this.getChild('#forbidden-mask');
        this.#scene_container        = this.getChild('#scene-container');
        this.#scene_container_resize = this.getChild('#scene-container-resize');
        this.#scene_container_modal  = this.getChild('#scene-container-modal');
        this.#scene_tree             = this.#scene.tree;
        this.#scene_container_vertical_resizer = new Resizer(this.#scene_container_resize, this.#scene_container);
        this.#scene_container_vertical_resizer.attach(false, true);
        this.#landscape_resizer = new Resizer(this.#resize, this);
        this.#landscape_resizer.setReverse(true);
        this.#landscape_resizer.attach(true, false);
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        if (this.#coordinator) {
            throw new Error("coordinator already exists");
        }
        this.#coordinator = coordinator;
        this.#scene.setCoordinator(coordinator);
        this.#aio.setCoordinator(coordinator);
        return this;
    }

    /**
     * 执行加载
     */
    load() {
        this.#aio.load();
        return this;
    }

    /**
     * 
     * 根据字符串获取模块
     * 
     * @param {*} name 
     */
    getModule(name) {
        if ('aio' === name) {
            return this.#aio;
        } else if ('scene' === name) {
            return this.#scene;
        }
    }

    /**
     * 
     * 显示或者隐藏
     * 
     * @param {boolean} visible 
     */
    setVisible(visible) {
        if (visible) {
            this.style.display = 'flex';
        } else {
            this.style.display = 'none';
        }
    }

    /**
     * 
     * 设置不允许交互
     * 
     * @param {boolean} forbidden 
     */
    setForbidden(forbidden) {
        this.setShowForbiddenMask(forbidden)
    }

    /**
     * 
     * 显示或者隐藏 禁止
     * 
     * @param {boolean} show 
     */
    setShowForbiddenMask(show) {
        if (show) {
            this.#forbidden_mask.style.display = 'block';
        } else {
            this.#forbidden_mask.style.display = 'none';
        }
    }

    /**
     * 
     * 获取场景Modal
     * 
     * @returns 
     */
    getSceneContainerModal() {
        return this.#scene_container_modal;
    }

    /**
     * 
     * 显示
     * 
     * @param {boolean} show 
     */
    showSceneContainerModal(show) {
        if (true === show) {
            this.#scene_container_modal.setAttribute('enable', "true");
        } else {
            this.#scene_container_modal.setAttribute('enable', "false");
        }
    }

    /**
     * 销毁
     */
    disposeSceneContainerModal() {
        this.showSceneContainerModal(false);
        this.#scene_container_modal.clear();
    }

    /**
     * 
     * 更新场景的树
     * 
     * @param {*} scene_changed 
     */
    markNeedUpdateTree(scene_changed = false) {
        if (this.#scene) {
            this.#scene.markNeedUpdateTree(scene_changed);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#scene.dispose();
        this.#aio  .dispose();
    }
}

CustomElementRegister(tagName, Moderator);
