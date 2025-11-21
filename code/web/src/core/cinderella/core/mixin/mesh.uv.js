/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';
import MeshUV from '@core/misc/mesh-uv';

/**
 * Mixin
 */
Object.assign(XThree.Mesh.prototype, {
    /**
     * 
     * 移除UV属性
     * 
     * @returns 
     */
    removeUV() {
        if (!this.hasUV()) {
            return false;
        } else {
            this.geometry.deleteAttribute('uv');
            return true;
        }
    },

    /**
     * 
     * 判断有没有UV
     * 
     * @returns 
     */
    hasUV() {
        return this.geometry && this.geometry.attributes.uv;
    },

    /**
     * 
     * UV 补偿
     * 
     * @returns 
     */
    trialCompensationUV() {
        if (!this.geometry) {
            return false;
        } else {
            MeshUV.trialCompensation(this);
            return true;
        }
    }
});

