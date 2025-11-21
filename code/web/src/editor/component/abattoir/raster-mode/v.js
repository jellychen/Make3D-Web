/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-raster-mode';

/**
 * 用来显示渲染的模式
 */
export default class RasterMode extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #performance;
    #raster;

    /**
     * 
     * 当前的模式
     * 
     * 
     * performance
     * raster
     * tracer
     * 
     */
    #mode = 'performance';

    /**
     * 外部回调
     */
    onchanged;

    /**
     * 获取
     */
    get mode() {
        return this.#mode;
    }

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
        this.#performance = this.getChild('#performance');
        this.#raster      = this.getChild('#raster');
        this.#performance.onclick = () => this.#onClickPerformance();
        this.#raster     .onclick = () => this.#onClickRaster();
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
     * 点击了性能
     */
    #onClickPerformance() {
        this.#mode = 'performance';
        this.#performance.setAttribute('selected', 'true');
        this.#raster     .setAttribute('selected', 'false');
        this.#onModeChanged(this.#mode);
        if (!this.#coordinator) {
            throw new Error("coordinator is undefined");
        }
        this.#coordinator.abattoir.showMaterialChangedAlert('performance');
        const scene = this.#coordinator.scene;
        scene.enableMaterialForPerformance(true);
        this.#coordinator.renderNextFrame();
    }

    /**
     * 点击了
     */
    #onClickRaster() {
        this.#mode = 'raster';
        this.#performance.setAttribute('selected', 'false');
        this.#raster     .setAttribute('selected', 'true');
        this.#onModeChanged(this.#mode);
        if (!this.#coordinator) {
            throw new Error("coordinator is undefined");
        }
        this.#coordinator.abattoir.showMaterialChangedAlert('raster');
        const scene = this.#coordinator.scene;
        scene.enableMaterialForPerformance(false);
        this.#coordinator.renderNextFrame();
    }

    /**
     * 
     * 当模式发生变化
     * 
     * @param {*} mode 
     */
    #onModeChanged(mode) {
        if (isFunction(this.onchanged)) {
            try {
                this.onchanged(this.#mode);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, RasterMode);

