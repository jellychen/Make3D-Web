/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import PbrMaterialEmbedded   from '@editor/component/abattoir/material-editor-embedded-pbr';
import MaterialEditorContext from './pbr-material-editor/context';
import PbrMaterialEditor     from './pbr-material-editor/v';
import                            './notice/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-material-uniform';

/**
 * 元素的属性
 */
export default class MaterialEditor extends Element {
    /**
     * 协调者
     */
    #coordinator;
    #coordinator_selected_container;

    /**
     * 场景
     */
    #scene;

    /**
     * 当前关注 element
     */
    #attached_element;
    #attached_element_material;

    /**
     * 元素
     */
    #container;
    #editor_hub;
    #editor_material_pbr;
    #editor_embedded_pbr;
    #notice;

    /**
     * 遮罩
     */
    #mask;

    /**
     * 事件回调
     */
    #on_elemnents_selected_changed = () => this.#onElementsSelectedChanged();
    #on_raster_mode_changed        = () => this.#onRasterModeMaybeChanged ();

    /**
     * 获取
     */
    get is_card() {
        return true;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super(tagName);
        this.#coordinator = coordinator;
        this.#coordinator.addEventListener('selected.changed', this.#on_elemnents_selected_changed);
        this.#scene = this.#coordinator.scene;
        this.#scene.addEventListener('raster-mode-maybe-changed', this.#on_raster_mode_changed);
        this.#coordinator_selected_container = this.#coordinator.selected_container;
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
        this.#notice              = this.getChild('#notice'      );
        this.#editor_embedded_pbr.onclick = event => this.#onClickEditorEmbeddedPbr(event);
        const context = new MaterialEditorContext();
        context.on_changed = (material, has_textures_changed) => {
            this.#onMaterialEditorChanged(material, has_textures_changed);
        };
        this.#editor_material_pbr = new PbrMaterialEditor(context);
        this.#editor_hub.appendChild(this.#editor_material_pbr);
        this.#update();
        this.#checkCurrentIsOnRasterMode();
    }

    /**
     * 选择发生了变化
     */
    #onElementsSelectedChanged() {
        this.#update();
    }

    /**
     * 更新显示
     */
    #update() {
        const count = this.#coordinator_selected_container.count();
        if (count == 1) {
            const element = this.#coordinator_selected_container.getOneValue();
            if (!element) {
                throw new Error("getOneValue error");
            }
            this.#attached_element = element;
            this.#attached_element_material = element.material;
            this.#editor_material_pbr.copyArgumentsFrom(element.material);
            this.showMask(false);
        } else {
            this.#attached_element = undefined;
            this.#attached_element_material = undefined;
            this.#editor_material_pbr.copyArgumentsFrom(undefined);
            this.#notice.setVisible(false);
            this.showMask(true);
        }
    }

    /**
     * 
     * 材质发生变化
     * 
     * @param {*} material 
     * @param {*} has_textures_changed 
     */
    #onMaterialEditorChanged(material, has_textures_changed) {
        if (this.#attached_element) {
            this.#attached_element.notifyMaterialChanged(
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
                            this.#attached_element_material, 
                            (has_textures_changed) => {
            this.#onMaterialEditorChanged(this.#attached_element_material, has_textures_changed);
            this.#editor_material_pbr.update();
        });
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
     * 检测渲染模式
     */
    #checkCurrentIsOnRasterMode() {
        if (this.#scene.isUsePerformanceMaterial()) {
            this.#notice.setVisible(true);
        } else {
            this.#notice.setVisible(false);
        }
    }

    /**
     * 渲染模式发生了变化
     */
    #onRasterModeMaybeChanged() {
        this.#checkCurrentIsOnRasterMode();
    }

    /**
     * 销毁函数
     */
    dispose() {
        this.#coordinator.removeEventListener('selected.changed', this.#on_elemnents_selected_changed);
        this.#scene.removeEventListener('raster-mode-maybe-changed', this.#on_raster_mode_changed);
    }
}

CustomElementRegister(tagName, MaterialEditor);
