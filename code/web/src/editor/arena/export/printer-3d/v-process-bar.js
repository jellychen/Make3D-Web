/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ConvertController     from './convert-controller';
import Html                  from './v-process-bar-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-export-printer-3d-process-bar';

/**
 * 导出进度条
 */
export default class ProcessBar extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #cancel;
    #progress;

    /**
     * 执行
     */
    #convert_controller;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#convert_controller = new ConvertController(
            coordinator, (mesh, current, total) => {
                this.#onProcess(mesh, current, total);
            },
            () => {
                this.dispose();
            });
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#cancel   = this.getChild('#cancel');
        this.#progress = this.getChild('#progress');
        this.#cancel.onclick = () => this.#onClickCancle();
    }

    /**
     * 
     * 启动
     * 
     * @param {*} format 
     * @param {*} selected_only 
     */
    start(format='obj', selected_only=false) {
        this.#convert_controller.process(format, selected_only);
    }

    /**
     * 点击取消按钮
     */
    #onClickCancle() {
        this.dispose();
    }

    /**
     * 
     * 进度
     * 
     * @param {*} mesh 
     * @param {*} current 
     * @param {*} total 
     */
    #onProcess(mesh, current, total) {
        this.#progress.value = current / total;
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Remove(this);
        this.#convert_controller.dispose();
    }
}

CustomElementRegister(tagName, ProcessBar);
