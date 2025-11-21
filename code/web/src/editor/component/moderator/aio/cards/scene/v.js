/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Camera                from './camera/v';
import Env                   from './env/v';
import Misc                  from './misc/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-scene';

/**
 * 设置场景的容器
 */
export default class Scene extends Element {
    /**
     * 协调器
     */
    #coordinator
    #coordinator_selected_container;

    /**
     * 元素
     */
    #camera;
    #env;
    #misc;

    /**
     * 元素
     */
    #gray_mask;

    /**
     * 事件回调
     */
    #on_elemnents_selected_changed = () => this.#onElementsSelectedChanged();

    /**
     * 获取
     */
    get is_card() {
        return true;
    }
    
    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        if (!coordinator) {
            throw new Error("coordinator is invalid");
        }
        this.#coordinator = coordinator;
        this.#coordinator.addEventListener('selected.changed', this.#on_elemnents_selected_changed);
        this.#coordinator_selected_container = this.#coordinator.selected_container;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#camera    = this.getChild('#camera');
        this.#env       = this.getChild('#env');
        this.#misc      = this.getChild('#misc');
        this.#gray_mask = this.getChild('#gray_mask');
        this.#camera.setCoordinator(this.#coordinator);
        this.#env   .setCoordinator(this.#coordinator);
        this.#misc  .setCoordinator(this.#coordinator);
        this.#camera.load();
        this.#env   .load();
        this.#misc  .load();
    }

    /**
     * 
     * 显示灰色遮罩
     * 
     * @param {*} show 
     */
    showGrayMask(show) {
        if (show) {
            this.#gray_mask.style.display = "block";
        } else {
            this.#gray_mask.style.display = "none";
        }
    }

    /**
     * 选择发生了变化
     */
    #onElementsSelectedChanged() {
        ;
    }

    /**
     * 更新
     */
    update() {
        this.#env .update();
        this.#misc.update();
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
    }
}

CustomElementRegister(tagName, Scene);
