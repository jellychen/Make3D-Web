/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './cell';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-light';

/**
 * 动画
 */
export default class Light extends Element {
    /**
     * 协调者
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 操作的灯光
     */
    #light;

    /**
     * 元素
     */
    #color;
    #intensity;
    #angle;

    /**
     * 元素
     */
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
        this.observerBubblesEvent();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#mask      = this.getChild('#mask');
        this.#color     = this.getChild('#color');
        this.#intensity = this.getChild('#intensity');
        this.#angle     = this.getChild('#angle');
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

            if (object && object.is_light_placeholder) {
                this.#mask.style.display = 'none';
                this.#updateLight(object.light);
            } else {
                this.#mask.style.display = 'block';
            }
        } else {
            this.#mask.style.display = 'block';
        }
    }

    /**
     * 
     * 更新灯光
     * 
     * @param {*} light 
     */
    #updateLight(light) {
        this.#light = light;
        this.#color.setHexColor(light.color.getHex());
        this.#intensity.setValue(light.intensity);
        if (light.angle) {
            this.#angle.setValue(Math.A2D_(light.angle));
        }
    }

    /**
     * 
     * 接收孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        event.stopPropagation();
        super.onRecvBubblesEvent(event);

        if (!this.#light) {
            return;
        }

        this.#light.notifyLightWillChanged();
        this.#light.setColor(this.#color.getHexColor());
        this.#light.setIntensity(this.#intensity.getValue());
        if (this.#light.setAngle) {
            this.#light.setAngle(Math.D2A_(this.#angle.getValue()));
        }
        this.#light.notifyLightChanged();
        this.#coordinator.renderNextFrame();
    }

    /**
     * 销毁
     */
    dispose() {
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
    }
}

CustomElementRegister(tagName, Light);
