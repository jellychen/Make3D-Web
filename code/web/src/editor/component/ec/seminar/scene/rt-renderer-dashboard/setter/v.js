/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Loader                from '@core/cinderella/loader';
import ShowEnvmapSelector    from '@editor/component/abattoir/envmap-selector';
import DefaultConf           from '../default-conf';
import DefaultConfCenter     from '../default-conf-center';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-setter';

/**
 * 设置器
 */
export default class Setter extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 所处的容器
     */
    #dashboard;

    /**
     * 渲染的View
     */
    #renderer_view;

    /**
     * 元素
     */
    #tiled;
    #hdr_preview;
    #hdr_setter;
    #bounces_numizer;
    #bounces_input;
    #env_intensity_numizer;
    #env_intensity_input;
    #transparent_switcher;
    #mask;

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
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#tiled                 = this.getChild('#tiled-switcher');
        this.#hdr_preview           = this.getChild('#hdr_preview');
        this.#hdr_setter            = this.getChild('#hdr_setter');
        this.#bounces_numizer       = this.getChild('#numizer-bounces-count');
        this.#bounces_input         = this.getChild('#input-bounces-count');
        this.#env_intensity_numizer = this.getChild('#numizer-env-intensity');
        this.#env_intensity_input   = this.getChild('#input-env-intensity');
        this.#transparent_switcher  = this.getChild('#background-transparent-switcher');
        this.#mask                  = this.getChild('#mask');
        this.#hdr_setter.onclick    = event => this.#onClickHdrSetter(event);
        this.#env_intensity_input   .addEventListener('changed', event => this.#onEnvIntensityInputChanged(event));
        this.#env_intensity_numizer .addEventListener('changed', event => this.#onEnvIntensityInputNumizerChanged(event));
        this.#tiled                 .addEventListener('changed', event => this.#onTiledChanged(event));
        this.#transparent_switcher  .addEventListener('changed', event => this.#onBackgroundTransparentChanged(event));
        this.#bounces_input         .addEventListener('changed', event => this.#onBouncesInputChanged(event));
        this.#bounces_numizer       .addEventListener('changed', event => this.#onBouncesInputNumizerChanged(event));

        // 设置当前的数值
        this.#hdr_preview.setUrl(DefaultConfCenter.ibl_thumb_url);
        this.#tiled.checked                = DefaultConfCenter.tiled;
        this.#transparent_switcher.checked = DefaultConfCenter.background_transparent;
        this.#env_intensity_input.value    = DefaultConfCenter.ibl_intensity;
        this.#env_intensity_numizer.value  = DefaultConfCenter.ibl_intensity;
        this.#bounces_input.value          = DefaultConfCenter.bounces;
        this.#bounces_numizer.value        = DefaultConfCenter.bounces;
    }

    /**
     * 渲染器初始化完成
     */
    onConstructFinish() {
        if (this.#mask) {
            Animation.Remove(this.#mask, () => {
                this.#mask = undefined;
            });
        }
    }

    /**
     * 
     * Env Intensity Changed
     * 
     * @param {*} event 
     */
    #onEnvIntensityInputChanged(event) {
        const value  = this.#env_intensity_input.value;
        const tracer = this.#renderer_view.tracer_renderer;
        this.#env_intensity_numizer.value = value;
        tracer.setEnvIntensity(value);
        DefaultConfCenter.ibl_intensity = value;
    }

    /**
     * 
     * Env Intensity Changed
     * 
     * @param {*} event 
     */
    #onEnvIntensityInputNumizerChanged(event) {
        const value  = this.#env_intensity_numizer.value;
        const tracer = this.#renderer_view.tracer_renderer;
        this.#env_intensity_input.value = value;
        tracer.setEnvIntensity(value);
        DefaultConfCenter.ibl_intensity = value;
    }

    /**
     * 
     * Bounces 变化
     * 
     * @param {*} event 
     */
    #onBouncesInputChanged(event) {
        const value = this.#bounces_input.value;
        const tracer = this.#renderer_view.tracer_renderer;
        this.#bounces_numizer.value = value;
        tracer.setBounces(value);
        DefaultConfCenter.bounces = value;
    }

    /**
     * 
     * Bounces 变化
     * 
     * @param {*} event 
     */
    #onBouncesInputNumizerChanged(event) {
        const value = this.#bounces_numizer.value;
        const tracer = this.#renderer_view.tracer_renderer;
        this.#bounces_input.value = value;
        tracer.setBounces(value);
        DefaultConfCenter.bounces = value;
    }

    /**
     * 
     * tile方式渲染
     * 
     * @param {*} event 
     */
    #onTiledChanged(event) {
        const checked = this.#tiled.checked;
        const tracer = this.#renderer_view.tracer_renderer;
        tracer.setTiled(checked);
        DefaultConfCenter.tiled = checked;
    }

    /**
     * 
     * 背景透明
     * 
     * @param {*} event 
     */
    #onBackgroundTransparentChanged(event) {
        const checked = this.#transparent_switcher.checked;
        const tracer = this.#renderer_view.tracer_renderer;
        tracer.setBackgroundTransparent(checked);
        DefaultConfCenter.background_transparent = checked;
    }

    /**
     * 
     * 点击HDR设置按钮
     * 
     * @param {*} event 
     */
    #onClickHdrSetter(event) {
        ShowEnvmapSelector(this.#hdr_setter, undefined, (blob, thumb_url) => {
            this.#hdr_preview.setUrl(thumb_url);
            const tracer_renderer = this.#renderer_view.tracer_renderer;
            if (tracer_renderer) {
                ;
            }
            
            DefaultConfCenter.ibl_thumb_url = thumb_url;
            Loader.loadHdrData(blob, (texture) => {
                DefaultConfCenter.ibl_texture_url = undefined;
                if (DefaultConfCenter.ibl_texture) {
                    DefaultConfCenter.ibl_texture.__$$_del_ref__();
                    DefaultConfCenter.ibl_texture = undefined;
                }
                DefaultConfCenter.ibl_texture = texture;
                tracer_renderer.updateEnvTexture(texture);
            });
        });
    }

    /**
     * 销毁
     */
    dismiss() {
        this.remove();
        this.#coordinator.moderator.scene.dismissModal();
    }
}

CustomElementRegister(tagName, Setter);
