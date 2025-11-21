/* eslint-disable no-unused-vars */

import XThree             from '@xthree/basic';
import ComponentAnimation from '../../component-animation';

/**
 * 
 * Mixin
 * 
 * 动画
 * 
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 获取动画。可能为空
     * 
     * @returns 
     */
    animation() {
        return this.userData.component_animation;
    },

    /**
     * 获取动画
     * 
     * 
     * @param {*} created_if_empty 
     */
    getAnimation(created_if_empty = false) {
        if (!this.userData.component_animation && created_if_empty) {
            this.userData.component_animation = new ComponentAnimation(this);
        }
        return this.userData.component_animation;
    },

    /**
     * 清理掉全部的动画
     */
    clearAllAnimations() {
        const animations = this.getAnimation();
        if (animations) {
            animations.clear();
        }
    },

    /**
     * 
     * 投递一个动画
     * 
     * @param {*} ani 
     */
    postAnimation(ani) {
        this.getAnimation(true).post(ani);
    },
});
