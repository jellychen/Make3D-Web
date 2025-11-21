/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import MaterialEditorContext from '../pbr-material-editor/prefab/context';
import PbrMaterialEditor     from '../pbr-material-editor/prefab/pbr/v';
import PbrMaterialEmbedded   from '@editor/component/abattoir/material-editor-embedded-pbr';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-material-uniform-rt';

/**
 * 
 * 元素光追材质
 * 
 * 只支持 PBR
 * 
 */
export default class RT extends Element {
    /**
     * 协调者
     */
    #coordinator;

    /**
     * 父亲
     */
    #host;

    /**
     * 当前关注 element
     */
    #attached_element;
    #attached_element_tracer_material;

    /**
     * 元素
     */
    #container;
    #editor_hub;
    #editor_material_pbr;
    #editor_embedded_pbr;

    /**
     * 遮罩
     */
    #mask;

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
        this.#container           = this.getChild('#container'   );
        this.#mask                = this.getChild('#mask'        );
        this.#editor_hub          = this.getChild('#editor-hub'  );
        this.#editor_embedded_pbr = this.getChild('#embedded-pbr');
        this.#editor_embedded_pbr.onclick = event => this.#onClickEditorEmbeddedPbr(event);
        const context = new MaterialEditorContext();
        context.on_changed = (material, has_textures_changed) => {
            this.#onMaterialEditorChanged(material, has_textures_changed);
        };
        this.#editor_material_pbr = new PbrMaterialEditor(context);
        this.#editor_hub.appendChild(this.#editor_material_pbr);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
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
     * 回滚到默认值
     */
    resetToDefault() {
        this.#attached_element = undefined;
        this.#attached_element_tracer_material = undefined;
        this.#editor_material_pbr.copyArgumentsFrom(undefined);

    }

    /**
     * 
     * attach 指定的元素
     * 
     * @param {*} element 
     */
    attach(element) {
        if (element && element.isMesh) {
            this.#attached_element = element;
            this.#attached_element_tracer_material = element.getTracerMaterial();
            this.#editor_material_pbr.copyArgumentsFrom(this.#attached_element_tracer_material);
        } else {
            this.resetToDefault();
        }
    }

    /**
     * detach
     */
    detach() {
        this.resetToDefault();
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

    // /**
    //  * 更新显示
    //  */
    // update() {
    //     const count = this.#coordinator_selected_container.count();
    //     if (count > 0) {
    //         const object = this.#coordinator_selected_container.getOneValue();
    //         if (!object) {
    //             throw new Error("getOneValue error");
    //         }
    //         this.showMask(false);
    //         this.attach(object);
    //     } else {
    //         this.resetToDefault();
    //         this.showMask(true);
    //     }
    // }

    /**
     * 
     * 材质发生变化
     * 
     * @param {*} material 
     * @param {*} has_textures_changed 
     */
    #onMaterialEditorChanged(material, has_textures_changed) {
        if (this.#attached_element) {
            this.#attached_element.notifyTracerMaterialChanged(
                'material.editor',
                has_textures_changed
            );
            this.#attached_element.requestRenderNextFrame();
        }
    }

    /**
     * 点击内置的PBR预设的材质
     */
    #onClickEditorEmbeddedPbr() {
        PbrMaterialEmbedded(this.#editor_embedded_pbr, 
                            10, 
                            this.#attached_element_tracer_material, 
                            (has_textures_changed) => {
            this.#onMaterialEditorChanged(this.#attached_element_tracer_material, 
                                          has_textures_changed);
            this.#editor_material_pbr.update();
        });
    }

    /**
     * 销毁函数
     */
    dispose() {
        ;
    }
}

CustomElementRegister(tagName, RT);
