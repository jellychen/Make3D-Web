/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import isUndefined              from 'lodash/isUndefined';
import XThree                   from '@xthree/basic';
import CustomElementRegister    from '@ux/base/custom-element-register';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Material                 from '@xthree/material/pbr';
import                               './cell';
import MaterialEditorPrefabBase from './editor-prefab-base';
import Html                     from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-prefab-pbr';

/**
 * PBR
 */
export default class MaterialEditorPrefabPbr extends MaterialEditorPrefabBase {
    /**
     * 元素
     */
    #container;

    /**
     * 元素
     */
    #alpha;
    #base_color;
    #base_color_texture;
    #normal_texture;
    #roughness_texture;
    #metalness_texture;
    #emissive;
    #emissive_intensity;
    #metalness;
    #roughness;
    #clearcoat;
    #ior;
    #sheen;
    #sheen_color;
    #specular_color;
    #thickness;
    #transmission;
    #subsurface;
    #subsurface_color;
    #subsurface_mfp;
    #absorption_color;
    #absorption_distance;

    /**
     * 材质
     */
    #material;

    /**
     * 
     * 构造函数
     * 
     * @param {*} context 
     */
    constructor(context) {
        super(tagName, context);
        this.observerBubblesEvent();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container           = this.getChild('#container');
        this.#alpha               = this.getChild('#alpha');
        this.#base_color          = this.getChild('#base-color');
        this.#base_color_texture  = this.getChild('#base-color-texture');
        this.#normal_texture      = this.getChild('#normal-texture');
        this.#roughness_texture   = this.getChild('#roughness-texture');
        this.#metalness_texture   = this.getChild('#metalness-texture');
        this.#emissive            = this.getChild('#emissive');
        this.#emissive_intensity  = this.getChild('#emissive-intensity');
        this.#metalness           = this.getChild('#roughness');
        this.#roughness           = this.getChild('#roughness');
        this.#clearcoat           = this.getChild('#clearcoat');
        this.#ior                 = this.getChild('#ior');
        this.#sheen               = this.getChild('#sheen');
        this.#sheen_color         = this.getChild('#sheen-color');
        this.#specular_color      = this.getChild("#specular-color");
        this.#thickness           = this.getChild('#thickness');
        this.#transmission        = this.getChild('#transmission');
        this.#subsurface          = this.getChild('#subsurface');
        this.#subsurface_color    = this.getChild('#subsurface-color');
        this.#subsurface_mfp      = this.getChild('#subsurface-mfp');
        this.#absorption_color    = this.getChild('#absorption');
        this.#absorption_distance = this.getChild('#absorption-distance');
    }

    /**
     * 更新
     */
    update() {
        if (!this.#material) {
            this.#base_color         .setColor(0);
            this.#alpha              .setValue(1);
            this.#emissive           .setColor(0);
            this.#emissive_intensity .setValue(0);
            this.#base_color_texture .setValue(undefined);
            this.#normal_texture     .setValue(undefined);
            this.#roughness_texture  .setValue(undefined);
            this.#metalness_texture  .setValue(undefined);
            this.#metalness          .setValue(0);
            this.#roughness          .setValue(0);
            this.#clearcoat          .setValue(0);
            this.#ior                .setValue(0);
            this.#sheen              .setValue(0);
            this.#sheen_color        .setColor(0);
            this.#specular_color     .setColor(0);
            this.#thickness          .setValue(0);
            this.#transmission       .setValue(0);
            this.#subsurface         .setValue(0);
            this.#subsurface_color   .setColor(0);
            this.#subsurface_mfp     .setValue(0);
            this.#absorption_color   .setColor(0);
            this.#absorption_distance.setValue(10);
        } else {
            const userData = this.#material.userData || {};
            if (isUndefined(userData.subsurface))       userData.subsurface      = 0;
            if (isUndefined(userData.subsurfaceColor))  userData.subsurfaceColor = [1, 1, 1];
            if (isUndefined(userData.subsurfaceMFP))    userData.subsurfaceMFP   = 0.05;
            if (isUndefined(userData.extinction))       userData.extinction      = [1, 1, 1];
            if (isUndefined(userData.atDistance))       userData.atDistance      = 10.0;
            this.#material.userData = userData;

            this.#base_color         .setColor(this.#material.color.getHex());
            this.#alpha              .setValue(this.#material.opacity);
            this.#emissive           .setColor(this.#material.emissive.getHex());
            this.#emissive_intensity .setValue(this.#material.emissiveIntensity);
            this.#base_color_texture .setValue(this.#material.map);
            this.#normal_texture     .setValue(this.#material.normalMap);
            this.#roughness_texture  .setValue(this.#material.roughnessMap);
            this.#metalness_texture  .setValue(this.#material.metalnessMap);
            this.#metalness          .setValue(this.#material.metalness);
            this.#roughness          .setValue(this.#material.roughness);
            this.#clearcoat          .setValue(this.#material.clearcoat);
            this.#ior                .setValue(this.#material.ior);
            this.#sheen              .setValue(this.#material.sheen);
            this.#sheen_color        .setColor(this.#material.sheenColor.getHex());
            this.#specular_color     .setColor(this.#material.specularColor.getHex());
            this.#thickness          .setValue(this.#material.thickness);
            this.#transmission       .setValue(this.#material.transmission);
            this.#subsurface         .setValue(this.#material.userData.subsurface);
            this.#subsurface_color   .setColor_RGB_normalization(this.#material.userData.subsurfaceColor);
            this.#subsurface_mfp     .setValue(this.#material.userData.subsurfaceMFP);
            this.#absorption_color   .setColor_RGB_normalization(this.#material.userData.extinction);
            this.#absorption_distance.setValue(this.#material.userData.atDistance);
        }
    }

    /**
     * 
     * 从指定的材质中拷贝参数
     * 
     * @param {*} material 
     */
    copyArgumentsFrom(material) {
        this.#material = material;
        this.update();
    }

    /**
     * 
     * 接收到冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        super.onRecvBubblesEvent(event);

        // 获取变动的参数类型
        const token = event.detail.token;

        // 更新属性
        if ('alpha' === token) {
            this.#material = this.getMaterial();
            this.#material.setAlpha(this.#alpha.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('base-color' === token) {
            this.#material = this.getMaterial();
            this.#material.setColor(this.#base_color.getColor());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('base-color-texture' === token) {
            this.#material = this.getMaterial();
            const url = this.#base_color_texture.url;
            if (isUndefined(url)) {
                this.#material.setColorTexture(null);
                this.requestRenderNextFrame();
                this.triggerChanged(this.#material, true);
            } else {
                this.#material.setColorTextureFromUrl(url, () => {
                    this.#base_color_texture.updateTexture(this.#material.map);
                    this.requestRenderNextFrame();
                    this.triggerChanged(this.#material, true);
                });
            }
        } 
        
        else if ('normal-texture' === token) {
            this.#material = this.getMaterial();
            const url = this.#normal_texture.url;
            if (isUndefined(url)) {
                this.#material.setNormalTexture(null);
                this.requestRenderNextFrame();
                this.triggerChanged(this.#material, true);
            } else {
                this.#material.setNormalTextureFromUrl(url, () => {
                    this.#normal_texture.updateTexture(this.#material.normalMap);
                    this.requestRenderNextFrame();
                    this.triggerChanged(this.#material, true);
                });
            }
        } 
        
        else if ('roughness-texture' === token) {
            this.#material = this.getMaterial();
            const url = this.#roughness_texture.url;
            if (isUndefined(url)) {
                this.#material.setRoughnessMap(null);
                this.requestRenderNextFrame();
                this.triggerChanged(this.#material, true);
            } else {
                this.#material.setRoughnessMapFromUrl(url, () => {
                    this.#roughness_texture.updateTexture(this.#material.roughnessMap);
                    this.requestRenderNextFrame();
                    this.triggerChanged(this.#material, true);
                });
            }
        } 
        
        else if ('metalness-texture' === token) {
            this.#material = this.getMaterial();
            const url = this.#metalness_texture.url;
            if (isUndefined(url)) {
                this.#material.setMetalnessTexture(null);
                this.requestRenderNextFrame();
                this.triggerChanged(this.#material, true);
            } else {
                this.#material.setMetalnessTextureFromUrl(url, () => {
                    this.#metalness_texture.updateTexture(this.#material.metalnessMap);
                    this.requestRenderNextFrame();
                    this.triggerChanged(this.#material, true);
                });
            }
        } 
        
        else if ('emissive' === token) {
            this.#material = this.getMaterial();
            this.#material.setEmissiveColor(this.#emissive.getColor());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('emissive-intensity' === token) {
            this.#material = this.getMaterial();
            this.#material.setEmissiveIntensity(this.#emissive_intensity.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('metalness' === token) {
            this.#material = this.getMaterial();
            this.#material.setMetalness(this.#metalness.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('roughness' === token) {
            this.#material = this.getMaterial();
            this.#material.setRoughness(this.#roughness.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('clearcoat' === token) {
            this.#material = this.getMaterial();
            this.#material.setClearCoat(this.#clearcoat.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('ior' === token) {
            this.#material = this.getMaterial();
            this.#material.setIOR(this.#ior.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('sheen' === token) {
            this.#material = this.getMaterial();
            this.#material.setSheen(this.#sheen.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('sheen-color' === token) {
            this.#material = this.getMaterial();
            this.#material.setSheenColor(this.#sheen_color.getColor());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('specular-color' === token) {
            this.#material = this.getMaterial();
            this.#material.setSpecularColor(this.#specular_color.getColor());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('thickness' === token) {
            this.#material = this.getMaterial();
            this.#material.setThickness(this.#thickness.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('transmission' === token) {
            this.#material = this.getMaterial();
            this.#material.setTransmission(this.#transmission.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('subsurface-color' === token) {
            const r = this.#subsurface_color.r / 255;
            const g = this.#subsurface_color.g / 255;
            const b = this.#subsurface_color.b / 255;
            this.#material = this.getMaterial();
            this.#material.userData.subsurfaceColor = [r, g, b];
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('subsurface' === token) {
            this.#material = this.getMaterial();
            this.#material.userData.subsurface = this.#subsurface.getValue();
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('subsurface-mfp' === token) {
            this.#material = this.getMaterial();
            this.#material.userData.subsurfaceMFP = this.#subsurface_mfp.getValue();
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('absorption' === token) {
            const r = this.#absorption_color.r / 255;
            const g = this.#absorption_color.g / 255;
            const b = this.#absorption_color.b / 255;
            this.#material = this.getMaterial();
            this.#material.setAttenuationColor(this.#absorption_color.getColor());
            this.#material.userData.extinction = [r, g, b];
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        } 
        
        else if ('absorption-distance' === token) {
            this.#material = this.getMaterial();
            this.#material.userData.atDistance = this.#absorption_distance.getValue();
            this.#material.setAtDistance(this.#absorption_distance.getValue());
            this.requestRenderNextFrame();
            this.triggerChanged(this.#material);
        }
    }

    /**
     * 
     * 获取材质
     * 
     * @returns 
     */
    getMaterial() {
        if (!this.#material) {
            this.#material = new Material();
        }
        return this.#material;
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#material) {
            this.#material.__$$_del_ref__();
            this.#material = undefined;
        }

        for (const item of this.#container.childNodes) {
            if (!isFunction(item.dispose)) {
                continue;
            }
            item.dispose();
        }
    }
}

CustomElementRegister(tagName, MaterialEditorPrefabPbr);
