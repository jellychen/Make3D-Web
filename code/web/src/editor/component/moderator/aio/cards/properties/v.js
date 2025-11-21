/* eslint-disable no-unused-vars */

import StopPointerEventPropagation from '@common/misc/stop-pointer-event-propagation';
import CustomElementRegister       from '@ux/base/custom-element-register';
import Element                     from '@ux/base/element';
import ElementDomCreator           from '@ux/base/element-dom-creator';
import Coordinate                  from './coordinate/v';
import UV                          from './uv/v';
import SmoothingLevel              from './smoothing-level/v';
import Visibility                  from './visibility/v';
import Html                        from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-properties';

/**
 * 元素的属性
 */
export default class Properties extends Element {
    /**
     * 协调者
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 元素
     */
    #container;
    #coordinate;
    #uv;
    #visibility;
    #smoothing_level;

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
        this.#container       = this.getChild('#container' );
        this.#coordinate      = this.getChild('#coordinate');
        this.#uv              = this.getChild('#uv');
        this.#visibility      = this.getChild('#visibility');
        this.#smoothing_level = this.getChild('#smoothing-level');
        this.#coordinate     .setCoordinator(this.#coordinator);
        this.#uv             .setCoordinator(this.#coordinator);
        this.#visibility     .setCoordinator(this.#coordinator);
        this.#smoothing_level.setCoordinator(this.#coordinator);
        this.#update();
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

            this.#coordinate     .showMask(false);
            this.#uv             .showMask(false);
            this.#visibility     .showMask(false);
            this.#coordinate     .attach(object );
            this.#uv             .attach(object );
            this.#visibility     .attach(object );
            this.#smoothing_level.attach(object );
        } else {
            this.#coordinate     .showMask(true);
            this.#visibility     .showMask(true);
            this.#uv             .showMask(true);
            this.#smoothing_level.showMask(true);
            this.#coordinate     .resetToDefault();
            this.#uv             .resetToDefault();
            this.#visibility     .resetToDefault();
            this.#smoothing_level.resetToDefault();
        }
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.#coordinate     .dispose();
        this.#uv             .dispose();
        this.#visibility     .dispose();
        this.#smoothing_level.dispose();
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
    }
}

CustomElementRegister(tagName, Properties);
