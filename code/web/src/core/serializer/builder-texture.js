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
     * 
     * 获取纹理
     * 
     * @returns 
     */
    builderTexture() {
        const uuid = this.read_Str();
        if (!isString(uuid) || '' == uuid) {
            return undefined;
        }
        return this.scene_texture_pool.getTexture(uuid);
    },
});
