/* eslint-disable no-unused-vars */

import XThree                from '@xthree/basic';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Loader                from '@core/cinderella/loader';
import ToImageUrl            from '@core/misc/texture-to-image';
import ShowEnvmapSelector    from '@editor/component/abattoir/envmap-selector';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-env';

/**
 * 环境灯光
 */
export default class Env extends Element {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 实时渲染器
     */
    #cinderella;

    /**
     * 元素
     */
    #hdr_setter;
    #img;
    #switcher;
    #env_intensity_slider;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        super.createContentFromTpl(tpl)
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#hdr_setter           = this.getChild('#hdr-setter');
        this.#img                  = this.getChild('#texture');
        this.#switcher             = this.getChild('#switcher');
        this.#env_intensity_slider = this.getChild('#intensity-slider');
        this.#hdr_setter.addEventListener('click', event => {
            ShowEnvmapSelector(this.#hdr_setter, undefined, (blob, thumb_url) => {
                this.#img.setUrl(thumb_url);

                // 场景
                if (!this.#cinderella) {
                    return;
                }

                const scene = this.#cinderella.getScene();
                if (!(scene instanceof XThree.Scene)) {
                    return;
                }

                // 加载
                Loader.loadHdrData(blob, (texture) => {
                    if (!texture) {
                        return;
                    }

                    // 
                    // recoder
                    // 如果是scene的场景，需要保留原来的值
                    if (this.#coordinator && this.#coordinator.isEcScene()) {
                        const recorder = this.#coordinator.getHistoricalRecorder();
                        if (recorder) {
                            const item = {};
                            item.coordinator = this.#coordinator;
                            item.scene       = scene;
                            item.texture     = scene.environment.__$$_add_ref__();
                            item.thumb_url   = scene.environment_thumb_url;
                            item.rollback    = function() {
                                scene.setEnvironment(this.texture);
                                scene.environment_thumb_url = this.thumb_url;
                                const moderator = this.coordinator.moderator;
                                const xpath     = moderator.xpath;
                                const module    = xpath.reset().module('aio').module('scene').current;
                                if (module) {
                                    module.update();
                                }
                                this.coordinator.renderNextFrame();
                            };

                            item.destroy = function() {
                                this.texture.__$$_del_ref__();
                            }
                            recorder.append(item);
                        }
                    }

                    // 设置
                    texture.mapping = XThree.EquirectangularReflectionMapping;
                    scene.setEnvironment(texture);
                    scene.environment_thumb_url = thumb_url;
                });
            });
        });
    }

    /**
     * 
     * 设置协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
        this.update();
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 执行加载
     */
    load() {

    }

    /**
     * 更新
     */
    update() {
        this.updateThumbImage();
    }

    /**
     * 更新小图标
     */
    updateThumbImage() {
        this.#cinderella = this.#coordinator.cinderella;
        const scene = this.#cinderella.getScene();
        if ((scene instanceof XThree.Scene)) {
            this.#img.setUrl(scene.environment_thumb_url);
        }
    }

    /**
     * 
     * 更新 intensity-slider
     * 
     * intensity 范围 0 - 2
     * 
     */
    
}

CustomElementRegister(tagName, Env);
