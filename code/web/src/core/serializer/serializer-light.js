/* eslint-disable no-unused-vars */

import isUndefined from 'lodash/isUndefined';
import Constants   from './constants';
import Serializer  from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储灯光
     * 
     * @param {*} light 
     * @returns 
     */
    storeLight(light) {
        const parent = light.parent;
        if (isUndefined(parent)) {
            return this;
        } else {
            const parent_matrix = parent.getMatrix(true);
            if (light.isDirectionalLight) {
                this.storeLightDir(light, parent_matrix);
            } else if (light.isPointLight) {
                this.storeLightPoint(light, parent_matrix);
            } else if (light.isSpotLight) {
                this.storeLightSpot(light, parent_matrix);
            }
            this.append_I32(Constants.T_LIGHT_END);
        }
        return this;
    },

    /**
     * 
     * 存储灯光
     * 
     * @param {*} light 
     * @param {*} matrix 
     * @returns 
     */
    storeLightDir(light, matrix) {
        this.append_I32  (Constants.T_LIGHT_DIR);
        this.append_Mat4 (matrix);
        this.append_Color(light.color);
        this.append_F32  (light.intensity);
        return this;
    },

    /**
     * 
     * 存储灯光
     * 
     * @param {*} light 
     * @param {*} matrix 
     * @returns 
     */
    storeLightPoint(light, matrix) {
        this.append_Byte (Constants.T_LIGHT_POINT);
        this.append_Mat4 (matrix);
        this.append_Color(light.color);
        this.append_F32  (light.intensity);
        return this;
    },

    /**
     * 
     * 存储灯光
     * 
     * @param {*} light 
     * @param {*} matrix 
     * @returns 
     */
    storeLightSpot(light, matrix) {
        this.append_I32  (Constants.T_LIGHT_SPOT);
        this.append_Mat4 (matrix);
        this.append_Color(light.color);
        this.append_F32  (light.intensity);
        this.append_F32  (light.angle);
        return this;
    },
});

