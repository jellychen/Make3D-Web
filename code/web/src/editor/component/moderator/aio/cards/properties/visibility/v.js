/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import XThree                from '@xthree/basic';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-visibility';

/**
 * 可见性
 */
export default class Visibility extends Element {
    /**
     * 协调器
     */
    #coordinator;
    
    /**
     * 当前关注 element
     */
    #attached_element;

    /**
     * 元素
     */
    #visible;               // 可见性
    #wireframe;             // 线框
    #flat;                  // 平直
    #double_side;           // 双面

    /**
     * 遮罩 
     */
    #mask;

    /**
     * 元素回调
     */
    #on_visible_changed = event => this.#onVisibleChanged(event);

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
        this.#mask        = this.getChild('#mask');
        this.#visible     = this.getChild('#visible');
        this.#wireframe   = this.getChild('#wireframe');
        this.#flat        = this.getChild('#flat');
        this.#double_side = this.getChild('#double-side');
        this.#visible.onchanged = () => {
            if (!this.#attached_element) {
                return;
            }
            
            // 
            // recoder
            // 如果是scene的场景，需要保留原来的值
            if (this.#coordinator.isEcScene()) {
                const ec = this.#coordinator.ec;
                if (ec && isFunction(ec.saveHistorical_ElementMatrix)) {
                    ec.saveHistorical_ElementVisible(this.#attached_element);
                }
            }

            // 设置值
            this.#attached_element.visible = this.#visible.check;
            this.#attached_element.notifyVisibleChanged('moderator-cards-visibility');
            this.#attached_element.requestRenderNextFrame();

            // 调整变换器
            this.#coordinator.updateTransformer();
        };

        this.#wireframe.onchanged = () => {
            if (!this.#attached_element) {
                return;
            }

            const material = this.#attached_element.material;
            if (!material) {
                return;
            }
            material.wireframe = this.#wireframe.check;

            this.#attached_element.requestRenderNextFrame();
        };

        this.#flat.onchanged = () => {
            if (!this.#attached_element) {
                return;
            }

            const material = this.#attached_element.material;
            if (!material) {
                return;
            }
            material.flatShading = this.#flat.check;

            this.#attached_element.requestRenderNextFrame();
        };

        this.#double_side.onchanged = () => {
            if (!this.#attached_element) {
                return;
            }

            const material = this.#attached_element.material;
            if (!material) {
                return;
            }

            if (this.#double_side.check) {
                material.side = XThree.DoubleSide;
            } else {
                material.side = XThree.FrontSide;
            }

            this.#attached_element.requestRenderNextFrame();
        };
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
        this.#visible.check = true;
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
        if (!this.#attached_element) {
            return;
        }

        this.#attached_element.addEventListener('visible-changed', this.#on_visible_changed);
        this.#visible.check = this.#attached_element.visible;

        // 获取材质
        const material = this.#attached_element.material;
        if (material) {
            this.#wireframe.check   = material.wireframe;
            this.#double_side.check = material.side == XThree.DoubleSide;
            this.#flat.check        = material.flatShading;
        }
    }

    /**
     * detach
     */
    detach() {
        if (!this.#attached_element) {
            return;
        }
        this.#attached_element.removeEventListener('visible-changed', this.#on_visible_changed);
        this.#attached_element = undefined;
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
     * 
     * 接受到信息
     * 
     * @param {*} event 
     */
    #onVisibleChanged(event) {
        if (event.reason == 'moderator-cards-visibility') {
            return;
        }
        
        if (this.#attached_element) {
            this.#visible.check = this.#attached_element.visible;
        }
    }

    /**
     * 销毁
     */
    dispose() {
        this.detach();
    }
}

CustomElementRegister(tagName, Visibility);

