/* eslint-disable no-unused-vars */

import StopPointerEventPropagation from '@common/misc/stop-pointer-event-propagation';
import CustomElementRegister       from '@ux/base/custom-element-register';
import Element                     from '@ux/base/element';
import ElementDomCreator           from '@ux/base/element-dom-creator';
import Raster                      from './raster/v';
import RT                          from './rt/v';
import Html                        from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-material-uniform';

/**
 * 元素的属性
 */
export default class MaterialUniform extends Element {
    /**
     * 协调者
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 元素
     */
    #board;
    #container;
    #rt;
    #raster;

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
     * 获取
     */
    get board() {
        return this.#board;
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
        this.#board     = this.getChild('#board');
        this.#container = this.getChild('#container');
        this.#rt        = this.getChild('#rt');
        this.#raster    = this.getChild('#raster');
        this.#rt    .setCoordinator(this.#coordinator);
        this.#raster.setCoordinator(this.#coordinator);
        this.#rt    .setHost(this);
        this.#raster.setHost(this);
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

            this.#raster.showMask(false);
            this.#rt    .showMask(false);
            this.#raster.attach(object );
            this.#rt    .attach(object );
        } else {
            this.#raster.showMask(true);
            this.#rt    .showMask(true);
            this.#raster.resetToDefault();
            this.#rt    .resetToDefault();
        }
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.#raster.dispose();
        this.#rt    .dispose();
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
    }
}

CustomElementRegister(tagName, MaterialUniform);
