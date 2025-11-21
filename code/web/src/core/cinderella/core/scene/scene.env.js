/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import LoadTexture from '../../loader/loader-texture';
import Scene       from "./scene";

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 设置IBL
     * 
     * @param {*} texture 
     */
    setEnvironment(texture) {
        if (texture == this.environment) {
            return;
        }

        if (texture && texture instanceof XThree.Texture) {
            texture.__$$_add_ref__();
        }

        if (this.environment && this.environment instanceof XThree.Texture) {
            this.environment.__$$_del_ref__();
        }

        this.environment = texture;
        this.requestAnimationFrameIfNeed();
    },

    /**
     * 
     * 从网络加载
     * 
     * @param {*} url 
     */
    setEnvironmentFromUrl(url) {
        if (typeof url !== 'string') {
            return;
        }

        const texture = LoadTexture.fromUrl(
            url,
            texture => this.requestAnimationFrameIfNeed(),
            undefined,
            () => this.requestAnimationFrameIfNeed()
        );
        this.setEnvironment(texture);
    },

    /**
     * 
     * 设置环境的能量
     * 
     * @param {*} intensity 
     * @returns 
     */
    setEnvironmentIntensity(intensity) {
        intensity = parseFloat(intensity);
        if (this.environmentIntensity == intensity) {
            return;
        } else {
            this.environmentIntensity = intensity;
            this.requestAnimationFrameIfNeed();
        }
    }
});
