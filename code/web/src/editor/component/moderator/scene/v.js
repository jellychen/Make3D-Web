/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import IntroducerConf        from '@core/introducer/configure';
import SceneSearcher         from './searcher/v';
import Tree                  from './tree/v';
import SceneModal            from './modal/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-scene';

/**
 * 场景管理器
 */
export default class Scene extends Element {
    /**
     * 核心协调器
     */
    #coordinator;

    /**
     * 核心渲染器
     */
    #abattoir;

    /**
     * 部件
     */
    #container;
    #searcher;
    #tree;

    /**
     * 用来遮罩的部件
     */
    #modal;

    /**
     * 获取
     */
    get searcher() {
        return this.#searcher;
    }

    /**
     * 获取
     */
    get tree() {
        return this.#tree;
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
        this.#container = this.getChild('#container');
        this.#searcher  = this.getChild('#searcher');
        this.#tree      = this.getChild('#tree');
        this.#searcher.setSceneTree(this.#tree);
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this.#tree, "introducer.scene.tree")
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.#abattoir = this.#coordinator.abattoir;
        this.#tree.setCoordinator(coordinator);
        this.#tree.setScene(coordinator.scene);
        this.#tree.update(true)
        this.#searcher.setCoordinator(coordinator);
    }

    /**
     * 
     * 根据字符串获取模块
     * 
     * @param {*} name 
     */
    getModule(name) {
        return undefined;
    }

    /**
     * 
     * 标记
     * 
     * @param {*} scene_change 
     */
    markNeedUpdateTree(scene_change = false) {
        if (this.#tree) {
            this.#tree.markNeedUpdateTree(scene_change);
        }
    }

    /**
     * 
     * 显示模态框
     * 
     * @returns 
     */
    showModal() {
        if (!this.#modal) {
            this.#modal = new SceneModal(this);
        }

        if (!this.#modal.parentNode) {
            this.#container.appendChild(this.#modal);
        }

        return this.#modal;
    }

    /**
     * 销毁对话框
     */
    dismissModal() {
        if (this.#modal) {
            this.#modal.clear();
            this.#modal.remove();
        }
    }

    /**
     * 销毁
     */
    dispose() {
        ;
    }
}

CustomElementRegister(tagName, Scene);
