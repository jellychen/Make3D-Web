/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ShowEventSelector     from './event/events-selector';
import AniItem               from './v-ani-item';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation';

/**
 * 动画
 */
export default class Animation extends Element {
    /**
     * 协调者
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 元素
     */
    #animation_container;

    /**
     * 元素
     */
    #more;
    #mask;

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
        this.#more = this.getChild('#more');
        this.#mask = this.getChild('#mask');
        this.#animation_container = this.getChild('#animation-container');
        this.#more.onclick = () => {
            ShowEventSelector(undefined, this.#more);
        };
        this.#update();

        // 测试
        const item = new AniItem(this.#coordinator);
        this.#animation_container.appendChild(item);
    }

    /**
     * 选择发生了变化
     */
    #onElementsSelectedChanged() {
        this.#update();
    }

    /**
     * 更新显示
     */
    #update() {
        const count = this.#coordinator_selected_container.count();
        if (count == 1) {
            const object = this.#coordinator_selected_container.getOneValue();
            if (!object) {
                throw new Error("getOneValue error");
            }
            this.#mask.style.display = 'none';
        } else {
            this.#mask.style.display = 'block';
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
    }
}

CustomElementRegister(tagName, Animation);