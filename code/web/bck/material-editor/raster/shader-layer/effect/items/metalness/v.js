/* eslint-disable no-unused-vars */

import isFunction            from 'lodash';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Setter                from './v-setter';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-shader-layer-block-metalness';

/**
 * 基础层
 */
export default class Block extends Element {
    /**
     * 获取
     */
    get type() {
        return 'metalness';
    }

    /**
     * 元素
     */
    #receptacle;

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
        this.#receptacle = this.getChild('#receptacle');
        this.#receptacle.onClickDelete = event => this.#onClickDelete(event);
        this.onclick = event => this.#onClick(event);
    }

    /**
     * 
     * 收集配置
     * 
     * @param {*} conf 
     * @returns 
     */
    collectConfiguration(conf) {
        return this;
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        Setter.Show(this);
    }

    /**
     * 
     * 点击删除
     * 
     * @param {*} event 
     */
    #onClickDelete(event) {
        Animation.Try(this, {
            scaleY    : [1, 0],
            opacity   : [1, 0],
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {
                try {
                    this.#onDestory();
                } catch (e) {
                    console.error(e);
                }
                this.remove();
            }
        });
    }

    /**
     * 销毁的回调
     */
    #onDestory() {

    }
}

CustomElementRegister(tagName, Block);
