/* eslint-disable no-unused-vars */

import XThree     from '@xthree/basic';
import Components from '../../components';

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
     * 获取全部的组建池子
     * 
     * @returns 
     */
    components() {
        return this.userData.components;
    },

    /**
     * 
     * 获取组建池子
     * 
     * @param {*} created_if_empty 
     */
    getComponents(created_if_empty = false) {
        if (!this.userData.components && created_if_empty) {
            this.userData.components = new Components(this);
        }
        return this.userData.components;
    },
});
