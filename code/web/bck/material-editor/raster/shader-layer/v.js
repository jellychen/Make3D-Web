/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './effect/v';
import                            './component/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer';

/**
 * shader 层
 */
export default class LayerContainer extends Element {
    /**
     * 协调者
     */
    #coordinator;

    /**
     * 关闭回调
     */
    onclose;

    /**
     * 元素
     */
    #component_layer;
    #component_effect;
    #exit;
    
    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#exit             = this.getChild('#exit');
        this.#component_layer  = this.getChild('#layer-component');
        this.#component_effect = this.getChild('#effect-component');
        this.#component_layer .setCoordinator(this.#coordinator);
        this.#component_effect.setCoordinator(this.#coordinator);
        this.#exit.onclick = () => this.dismiss();
    }

    /**
     * 
     * 销毁
     * 
     * @param {*} animation 
     */
    dismiss(animation = true) {
        if (animation) {
            Animation.Try(this, {
                duration  : 180,
                left      : '100%',
                easing    : 'out',
                onComplete: () => {
                    if (isFunction(this.onclose)) {
                        try {
                            this.onclose();
                        } catch(e) {
                            console.error(e);
                        }
                    }
                    this.#onDestory();
                }
            });
        } else {
            this.#onDestory();
        }
    }

    /**
     * 销毁
     */
    #onDestory() {

    }
}

CustomElementRegister(tagName, LayerContainer);
