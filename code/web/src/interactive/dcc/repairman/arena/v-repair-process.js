/* eslint-disable no-unused-vars */

import isFunction            from "lodash/isFunction";
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Repair                from './repair';
import Html                  from './v-repair-process-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-repair-process';

/**
 * 进度条
 */
export default class RepairProcess extends Element {
    /**
     * 场景
     */
    #scene;

    /**
     * 回调函数
     */
    on_finish;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
        this.#scene = scene;
    }

    /**
     * 
     * 处理
     * 
     * @param {*} format 
     */
    processAndDownload(format='obj') {
        const start = performance.now();
        const repair = new Repair(this.#scene);
        repair.on_finish = () => {
            const e = performance.now() - start;
            if (e > 1200) {
                this.#onFinish();
            } else {
                setTimeout(() => {
                    this.#onFinish();
                }, 1200 - e);
            }
        };
        repair.process(format);
    }

    /**
     * 结束
     */
    #onFinish() {
        if (isFunction(this.on_finish)) {
            this.on_finish();
        }
        this.remove();
    }
}

CustomElementRegister(tagName, RepairProcess);