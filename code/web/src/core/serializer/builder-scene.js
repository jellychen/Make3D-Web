/* eslint-disable no-unused-vars */

import isString  from 'lodash/isString';
import XThree    from '@xthree/basic';
import Constants from './constants';
import Builder   from './builder';

/**
 * Mixin
 */
Object.assign(Builder.prototype, {
    /**
     * 构建
     * 
     * @returns 
     */
    builderScene() {
        this.read_I32_AndCheck(Constants.T_SCENE);
        
        // 创建
        this.scene = new XThree.Scene();

        // 读取数据
        const scene   = this.scene;
        scene.name    = this.read_Str();
        scene.uuid    = this.read_Str();
        scene.visible = this.read_Byte() == 1;
        scene.matrix  = this.read_Mat4(scene.matrix);
        scene.decompose();

        // 读取孩子
        const children_count = this.read_I32();
        if (children_count > 0) {
            this.read_I32_AndCheck(Constants.T_CHILDREN_BEGIN);
            for (let i = 0; i < children_count; ++i) {
                this.builderObject(scene);
            }
            this.read_I32_AndCheck(Constants.T_CHILDREN_END);
        }

        // 读取结束
        this.loaded_success = true;
        return true;
    },
});
