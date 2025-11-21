/* eslint-disable no-unused-vars */

import CustomElementRegister        from '@ux/base/custom-element-register';
import Element                      from '@ux/base/element';
import ElementDomCreator            from '@ux/base/element-dom-creator';
import ShowSmoothingLevelController from '@editor/arena/smoothing-level-controller';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-smoothing-level';

/**
 * 平滑等级
 */
export default class SmoothingLevel extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 当前关注 element
     */
    #attached_element;

    /**
     * 遮罩 
     */
    #mask;
    #value;
    #setter;

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
        this.#mask           = this.getChild('#mask');
        this.#value          = this.getChild('#value');
        this.#setter         = this.getChild('#setter');
        this.#setter.onclick = event => this.#onSetterClick(event);
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 回滚到默认值
     */
    resetToDefault() {
        this.#attached_element = undefined;
        this.update();
    }

    /**
     * 
     * attach 指定的元素
     * 
     * @param {*} element 
     */
    attach(element) {
        this.detach();
        this.#attached_element = element;
        this.update();
    }

    /**
     * detach
     */
    detach() {
    }

    /**
     * 
     * 设置
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
     * 更新
     */
    update() {
        if (this.#attached_element && this.#attached_element.isEditableMesh) {
            this.showMask(false);
            const angle = Math.A2D_(this.#attached_element.crease_angle);
            this.#value.innerText = `${angle.toFixed(1)}`;
        } else {
            this.showMask(true);
            this.#value.innerText = '0';
        }
    }

    /**
     * 
     * 点击设置
     * 
     * @param {*} event 
     */
    #onSetterClick(event) {
        if (this.#attached_element) {
            const controller = ShowSmoothingLevelController(
                this.#coordinator, this.#attached_element, undefined, this.#setter);
            if (!controller) {
                return;
            }
            controller.on_value_changed = value => {
                this.#value.innerText = `${value.toFixed(1)}`;
            };
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
    }
}

CustomElementRegister(tagName, SmoothingLevel);
