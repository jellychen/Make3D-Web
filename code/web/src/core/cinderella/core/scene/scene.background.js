/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isNumber    from 'lodash/isNumber';
import LoadTexture from '../../loader/loader-texture';
import Scene       from "./scene";

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 设置背景颜色
     * 
     * @param {*} color 
     */
    setBackgroundColor(color) {
        if (isNumber(color)) {
            if (this.background) {
                this.background.setHex(color);
            } else {
                this.background = new XThree.Color(color);
            }
        } else {
            this.background = null;
        }
        this.requestAnimationFrameIfNeed();
    },

    /**
     * 
     * 设置背景贴图
     * 
     * @param {*} texture 
     */
    setBackgroundTexture(texture) {
        if (texture == this.background) {
            return;
        }

        if (texture && texture instanceof XThree.Texture) {
            texture.__$$_add_ref__();
        }

        if (this.background && this.background instanceof XThree.Texture) {
            this.background.__$$_del_ref__();
        }

        this.background = texture;
        this.requestAnimationFrameIfNeed();
    },

    /**
     * 
     * 设置背景贴图
     * 
     * @param {*} url 
     */
    setBackgroundTextureFromUrl(url) {
        if (typeof url !== 'string') {
            return;
        }
        
        const texture = LoadTexture.fromUrl(
            url,
            () => this.requestAnimationFrameIfNeed(),
            undefined,
            () => this.requestAnimationFrameIfNeed(),
        );
        return this.setBackgroundTexture(texture);
    }
});
