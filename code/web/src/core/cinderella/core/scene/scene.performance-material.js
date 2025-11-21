/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Scene       from "./scene";
import AspectColor from '@xthree/material/aspect-color-not-smooth';

/**
 * 材质单例
 */
let material;

/**
 * 
 * 获取
 * 
 * @returns 
 */
function GetPerformanceMaterial() {
    if (!material) {
        material = new AspectColor();
        material.setEnhance(1);
        material.setFrontColor(0x848484);
        material.setBackColor (0x484848);
        material.performance_material = true;
        material.polygonOffset        = true;
        material.polygonOffsetFactor  = 1;
        material.polygonOffsetUnits   = 1;
    }
    return material;
}

/**
 * Mixin
 */
Object.assign(Scene.prototype, {
    /**
     * 
     * 判断是不是使用性能材质
     * 
     * @returns 
     */
    isUsePerformanceMaterial() {
        return this.overrideMaterial == GetPerformanceMaterial();
    },

    /**
     * 
     * 使用性能材质
     * 
     * @param {*} enable 
     * @returns 
     */
    enableMaterialForPerformance(enable) {
        if (enable) {
            this.forbidden_shadow = true;
            this.overrideMaterial        = GetPerformanceMaterial();
        } else {
            this.forbidden_shadow = false;
            this.overrideMaterial        = null;
        }
        this.dispatchEvent({ type : 'raster-mode-maybe-changed' });
        return this;
    }
});
