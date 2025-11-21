/* eslint-disable no-unused-vars */

import Animation                  from '@common/misc/animation';
import CustomElementRegister      from '@ux/base/custom-element-register';
import Element                    from '@ux/base/element';
import ElementDomCreator          from '@ux/base/element-dom-creator';
import CreateShaderLayerContainer from './shader-layer';
import Html                       from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-material-uniform-raster';

/**
 * 
 * 材质编辑器
 * 
 * shader 节点编辑器
 * 
 */
export default class Raster extends Element {
    /**
     * 协调者
     */
    #coordinator;

    /**
     * 父亲
     */
    #host;

    /**
     * moderator
     */
    #moderator;
    #moderator_aio;

    /**
     * 当前关注 element
     */
    #attached_element;
    #attached_element_tracer_material;

    /**
     * 元素
     */
    #container;
    #open;

    /**
     * 遮罩
     */
    #mask;

    /**
     * 材质层
     */
    #shader_layer_container;

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
        this.#container = this.getChild('#container');
        this.#mask      = this.getChild('#mask'     );
        this.#open      = this.getChild('#open'     );
        this.#open.onclick = event => this.#onClickOpenButton(event);

    }

    /**
     * 
     * 设置
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator   = coordinator;
        this.#moderator     = this.#coordinator.moderator;
        this.#moderator_aio = this.#moderator.aio;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} host 
     */
    setHost(host) {
        this.#host = host;
    }

    /**
     * 
     * attach 指定的元素
     * 
     * @param {*} element 
     */
    attach(element) {
        ;
    }

    /**
     * detach
     */
    detach() {
        ;
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
     * 重置
     */
    resetToDefault() {
        if (this.#shader_layer_container) {
            this.#shader_layer_container.dismiss(true);
            this.#shader_layer_container = undefined;
        }
    }

    /**
     * 
     * 点击了按钮
     * 
     * @param {*} event 
     */
    #onClickOpenButton(event) {
        this.#shader_layer_container = CreateShaderLayerContainer(this.#coordinator);
        this.#shader_layer_container.style.left = '100%'
        this.#shader_layer_container.onclose = () => this.#shader_layer_container = undefined;
        this.#host.board.appendChild(this.#shader_layer_container);
        Animation.Try(this.#shader_layer_container, {
            duration: 180,
            left    : 0,
            easing  : 'out',
        });
    }

    /**
     * 销毁函数
     */
    dispose() {
        if (this.#shader_layer_container) {
            this.#shader_layer_container.dismiss(false);
            this.#shader_layer_container = undefined;
        }
    }
}

CustomElementRegister(tagName, Raster);
