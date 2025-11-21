/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

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
     * 组件
     * 
     * @param {*} time 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     */
    tickComponent(time, renderer, scene, camera) {
        const components = this.components();
        if (components) {
            components.tick(this, time, renderer, scene, camera);
        }
    },
});