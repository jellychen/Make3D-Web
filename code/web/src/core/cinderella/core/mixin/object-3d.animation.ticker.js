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
     * 执行动画
     * 
     * @param {*} time 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     */
    tickAnimation(time, renderer, scene, camera) {
        const animation = this.animation();
        if (animation) {
            animation.tick(this, time, renderer, scene, camera);
        }
    }
});
