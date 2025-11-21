/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-changed-alert';

/**
 * 整体材质切换的通知
 */
export default class MaterialChangedAlert extends Element {
    /**
     * 元素
     */
    #icon;
    #text;

    /**
     * 销毁回调
     */
    ondismiss;

    /**
     * 销毁定时器
     */
    #dismiss_timer;

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
        this.#icon = this.getChild('#icon');
        this.#text = this.getChild('#text');
    }

    /**
     * 显示光栅化材质
     */
    showMaterialRaster() {
        this.#icon.setIcon("ui/raster-0.svg");
        this.#text.setToken("use.raster.material");
    }

    /**
     * 显示光追材质
     */
    showMaterialRt() {
        this.#icon.setIcon("ui/rt-renderer.svg");
        this.#text.setToken("use.rt.material");
    }

    /**
     * 显示性能材质
     */
    showMaterialPerformance() {
        this.#icon.setIcon("ui/raster-performance.svg");
        this.#text.setToken("use.performance.material");
    }

    /**
     * 立刻销毁
     */
    dismiss() {
        this.remove();
        if (this.#dismiss_timer) {
            clearTimeout(this.#dismiss_timer);
            this.#dismiss_timer = undefined;
        }
        if (isFunction(this.ondismiss)) {
            this.ondismiss();
        }
    }

    /**
     * 
     * 延迟销毁
     * 
     * @param {*} time_ms 
     */
    dismissAfter(time_ms) {
        if (this.#dismiss_timer) {
            clearTimeout(this.#dismiss_timer);
            this.#dismiss_timer = undefined;
        }
        this.#dismiss_timer = setTimeout(() => {
            this.#dismiss_timer = undefined;
            this.dismiss();
        }, time_ms);
    }
}

CustomElementRegister(tagName, MaterialChangedAlert);
