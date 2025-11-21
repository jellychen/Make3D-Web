/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import VipSupervisor         from '@editor/arena/vip-supervisor';
import CloseAlert            from '../v-close-alert';
import Quality               from './v-quality';
import SampleCount           from './v-sample-count';
import Size                  from './v-size';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-toolbar';

/**
 * 光追的工具条
 */
export default class Toolbar extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 元素
     */
    #return;
    #play_pause;
    #refresh;
    #take_photo;
    #mask;
    #size;
    #sample_count;
    #quality;

    /**
     * 所处的容器
     */
    #dashboard;

    /**
     * 渲染的View
     */
    #renderer_view;

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer_view 
     * @param {*} dashboard 
     * @param {*} coordinator 
     */
    constructor(renderer_view, dashboard, coordinator) {
        super(tagName);
        this.#dashboard     = dashboard;
        this.#renderer_view = renderer_view;
        this.#coordinator   = coordinator;
        this.createContentFromTpl(tpl);
        this.#renderer_view.addEventListener('render-start', () => this.#onRenderStart());
        this.#renderer_view.addEventListener('render-end'  , () => this.#onRenderEnd  ());
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#return       = this.getChild('#return');
        this.#play_pause   = this.getChild('#play-pause');
        this.#refresh      = this.getChild('#refresh');
        this.#take_photo   = this.getChild('#take-photo');
        this.#mask         = this.getChild('#mask');
        this.#size         = this.getChild('#size');
        this.#sample_count = this.getChild('#sample-count');
        this.#quality      = this.getChild('#quality');
        this.#play_pause.addEventListener('changed', event => this.#onPlayPauseChange(event));
        this.#return    .onclick  = event  => this.#onClickReturn(event);
        this.#refresh   .onclick  = event  => this.#onClickRefresh(event);
        this.#take_photo.onclick  = event  => this.#onClickTakePhoto(event);
        this.#quality   .onchange = token  => this.#onRenderQualityChange(token);
        this.#size      .onchange = (w, h) => this.#onRenderSizeChanged(w, h);
    }

    /**
     * 
     * 是否显示掩码
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
     * 设置采用数
     * 
     * @param {*} target 
     * @param {*} current 
     */
    setSampleCount(target, current) {
        this.#sample_count.setCount(target, current);
    }

    /**
     * 
     * 设置播放按钮的状态
     * 
     * @param {*} playing 
     */
    setPlayingStatus(playing) {
        if (playing) {
            this.#play_pause.checked = false;
        } else {
            this.#play_pause.checked = true;
        }
    }

    /**
     * 
     * 退出
     * 
     * @param {*} event 
     */
    #onClickReturn(event) {
        const alert = new CloseAlert();
        alert.onclick_close = () => {
            this.remove();

            // 1. 恢复nav
            this.#coordinator.nav.showModalContaienr(false);

            // 2. abattoir 恢复
            const abattoir = this.#coordinator.abattoir;
            const abattoir_upper_slots = abattoir.upper_slots;
            abattoir_upper_slots.clear();
            abattoir_upper_slots.setVisible(false);

            // 3. 销毁渲染器
            this.#renderer_view.dispose();
        };
        this.#dashboard.container.appendChild(alert);
    }
    
    /**
     * 
     * 渲染/暂停
     * 
     * @param {*} event 
     */
    #onPlayPauseChange(event) {
        const pause = this.#play_pause.checked;
        if (pause) {
            this.#renderer_view.stop();
        } else {
            this.#renderer_view.resume();
        }
    }

    /**
     * 
     * 点击刷新
     * 
     * @param {*} event 
     */
    #onClickRefresh(event) {
        this.#renderer_view.refresh();
    }

    /**
     * 
     * 拍照
     * 
     * @param {*} event 
     */
    #onClickTakePhoto(event) {
        if (!VipSupervisor(this.#take_photo)) {
            return;
        }
        this.#renderer_view.saveAsPng();
    }

    /**
     * 渲染开始
     */
    #onRenderStart() {
        this.setPlayingStatus(true);
    }

    /**
     * 渲染结束
     */
    #onRenderEnd() {
        this.setPlayingStatus(false);
    }

    /**
     * 
     * 渲染的质量发生变化
     * 
     * @param {*} qulity 
     */
    #onRenderQualityChange(quality) {
        this.#renderer_view.setQuality(quality);
    }

    /**
     * 
     * 渲染的尺寸发生了变化
     * 
     * @param {*} w 
     * @param {*} h 
     */
    #onRenderSizeChanged(w, h) {
        this.#dashboard.setRenderSize(w, h);
    }
}

CustomElementRegister(tagName, Toolbar);