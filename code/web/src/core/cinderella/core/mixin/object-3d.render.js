/* eslint-disable no-unused-vars */

import isFunction from 'lodash/isFunction';
import XThree     from '@xthree/basic';

/**
 * 备份 dispose
 */
const _original_on_before_render = XThree.Object3D.prototype.onBeforeRender;
const _original_on_after_render  = XThree.Object3D.prototype.onAfterRender;

/**
 * Mixin
 */
Object.assign(XThree.Object3D.prototype, {
    /**
     * 
     * 留给外部覆盖
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} geometry 
     * @param {*} material 
     * @param {*} group 
     */
    onHookBeforeRender(renderer, scene, camera, geometry, material, group) {
        ;
    },

    /**
     * 
     * 留给外部覆盖
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} geometry 
     * @param {*} material 
     * @param {*} group 
     */
    onHookAfterRender(renderer, scene, camera, geometry, material, group) {
        ;
    },

    /**
     * 
     * 渲染之前
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} geometry 
     * @param {*} material 
     * @param {*} group 
     */
    onBeforeRender(renderer, scene, camera, geometry, material, group) {
        if (isFunction(_original_on_before_render)) {
            _original_on_before_render.call(this, renderer, scene, camera, geometry, material, group);
        }

        this.onHookBeforeRender(renderer, scene, camera, geometry, material, group);

        // 材质
        if (scene && isFunction(scene.onObjectBeforeRender)) {
            scene.onObjectBeforeRender(
                renderer, 
                scene,
                camera, 
                this,
                material, 
                group);
        }

        // 如果是覆盖
        if (material && material.allowOverride && scene.overrideMaterial) {
            material = scene.overrideMaterial;
        }

        if (material && isFunction(material.onObjectBeforeRender)) {
            material.onObjectBeforeRender(renderer, scene, camera, this);
        }

        // 时间
        const current_time = performance.now();

        // 动画执行
        this.tickAnimation(current_time);

        // 组建
        this.tickComponent(current_time, renderer, scene, camera);
    },

    /**
     * 
     * 渲染之后
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} geometry 
     * @param {*} material 
     * @param {*} group 
     */
    onAfterRender(renderer, scene, camera, geometry, material, group) {
        if (isFunction(_original_on_after_render)) {
            _original_on_after_render.call(this, renderer, scene, camera, geometry, material, group);
        }

        this.onHookAfterRender(renderer, scene, camera, geometry, material, group);

        if (scene && isFunction(scene.onObjectAfterRender)) {
            scene.onObjectAfterRender(
                renderer, 
                scene,
                camera, 
                this,
                material, 
                group);
        }

        // 如果是覆盖
        if (material && material.allowOverride && scene.overrideMaterial) {
            material = scene.overrideMaterial;
        }

        if (material && isFunction(material.onObjectAfterRender)) {
            material.onObjectAfterRender(renderer, scene, camera, this);
        }
    }
});
