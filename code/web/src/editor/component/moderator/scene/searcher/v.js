/* eslint-disable no-unused-vars */

import isString                       from 'lodash/isString';
import isArray                        from 'lodash/isArray';
import CustomElementRegister          from '@ux/base/custom-element-register';
import Element                        from '@ux/base/element';
import ElementDomCreator              from '@ux/base/element-dom-creator';
import IntroducerConf                 from '@core/introducer/configure';
import IndexSearcher                  from './index-searcher';
import SceneSearcherCandidateSelector from './v-candidate-selector';
import Html                           from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-r-scene-searcher';

/**
 * 搜索
 */
export default class SceneSearcher extends Element {
    /**
     * 核心协调器
     */
    #coordinator = undefined;

    /**
     * 场景
     */
    #scene;

    /**
     * 用来显示的场景树
     */
    #scene_tree;

    /**
     * 搜索引擎
     */
    #index_searcher = undefined;

    /**
     * 元素
     */
    #container;
    #input;

    /**
     * 事件回调
     */
    #onkeydown = (event) => this.#onKeyDown(event);

    /**
     * 候选选择器
     */
    #selector_ = undefined;

    /**
     * 输入框延迟
     */
    #on_input_changed_delay_timer = null;

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
        this.#input = this.getChild('#input');
        this.#input.addEventListener('focus',   (event) => this.#onFocus(event));
        this.#input.addEventListener('keydown', (event) => this.#onKeyDown(event));
        this.#input.addEventListener('input',   (event) => {
            this.#onInputChanged(event.target.value);
        });
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        //
        // 添加引导
        //
        IntroducerConf.add(this, "introducer.scene.search");
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 
     * 外部传入协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        if (!coordinator) {
            return;
        }
        this.#coordinator = coordinator;
        this.#scene = coordinator.scene;
    }

    /**
     * 
     * 设置场景树组件
     * 
     * @param {*} tree 
     */
    setSceneTree(tree) {
        this.#scene_tree = tree;
    }

    /**
     * 
     * 收到焦点
     * 
     * @param {*} event 
     */
    #onFocus(event) { 
        this.#buildSeacherIndex();
    }

    /**
     * 
     * 输入框变化
     * 
     * @param {string} value 
     */
    #onInputChanged(value) {
        if (this.#on_input_changed_delay_timer) {
            clearTimeout(this.#on_input_changed_delay_timer);
        }
        this.#on_input_changed_delay_timer = setTimeout(() => {
            this.#onInputChangedDelay()
        }, 300);
    }

    /**
     * 限流
     */
    #onInputChangedDelay() {
        this.#on_input_changed_delay_timer = undefined;
        let key = this.#input.value;
        if (!key || !isString(key)) {
            this.dismissCandidate();
            return;
        }

        // 根据搜索结果显示候选项目
        let result = this.#index_searcher.search(key);
        if (isArray(result) && result.length > 0) {
            this.showCandidate(result);
        } else {
            this.dismissCandidate();
        }
    }

    /**
     * 
     * 监听键盘上下按键
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        if (!this.#selector_) {
            return;
        }

        if ("ArrowUp" === event.key) {    
            this.#selector_.setSelectNextOrLast(false);
            event.preventDefault();
        } else if ("ArrowDown" === event.key) {
            this.#selector_.setSelectNextOrLast(true);
            event.preventDefault();
        } else if (event.key === "Enter" || event.keyCode === 13) {
            this.onCandidateSelected(this.#selector_.getSelectedUserData());
            this.dismissCandidate();
            event.preventDefault();
        }
    }

    /**
     * 
     * 构建搜索索引
     * 
     * @param {*} focus 
     * @returns 
     */
    #buildSeacherIndex(focus = false) {
        if (!this.#scene) {
            return;
        }

        if (this.#index_searcher) {
            return;
        } else {
            this.#index_searcher = new IndexSearcher();
        }

        // 构建索引
        this.#index_searcher.beginBuild();
        this.#scene.traverse((e) => {
            let uuid = e.uuid;
            let type = e.type;
            let name = e.getNameOrTypeAsName();
            let ref  = e.getWeakRef();
            console.log(name);
            this.#index_searcher.add(type, name, {
                uuid: uuid,
                ref : ref,
            });
        }, false);
        this.#index_searcher.commit();
    }

    /**
     * 
     * 显示候选词
     * 
     * @param {Array} data 
     */
    showCandidate(data) {
        if (undefined == this.#selector_) {
            this.#selector_ = new SceneSearcherCandidateSelector();
            this.#selector_.onselected = (data) => this.onCandidateSelected(data);
            this.#selector_.ondismiss  = (    ) => this.onCandidateDimiss();
            this.#container.appendChild(this.#selector_);
        }
        this.#selector_.setCandidate(data);
        this.#selector_.place(this.#container);
    }

    /**
     * 消除候选词
     */
    dismissCandidate() {
        if (this.#selector_) {
            this.#selector_.remove();
            this.#selector_ = undefined;
        }
    }

    /**
     * 候选取消
     */
    onCandidateDimiss() {
        this.#selector_ = undefined;
    }

    /**
     * 
     * 选中
     * 
     * @param {*} user_data 
     */
    onCandidateSelected(user_data) {
        // 清理候选框
        this.dismissCandidate();

        // 检测数据
        if (!this.#scene_tree) {
            return;
        }

        // 获取信息
        user_data = user_data || {};
        let uuid = user_data.uuid || '';
        let ref  = user_data.ref;
        if (ref) {
            ref = ref.deref();
        }

        // 检测数据完整性
        if (!isString(uuid) || undefined == ref) {
            return;
        }

        // 滚动到指定的元素
        this.#scene_tree.scrollToSenceObject(ref, true);
    }
}

CustomElementRegister(tagName, SceneSearcher);
