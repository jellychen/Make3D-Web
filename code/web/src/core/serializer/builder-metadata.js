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
     * 构建
     * 
     * @returns 
     */
    builderMetadata() {
        // 读取元数据
        if (this.remaining < 12) {
            throw new Error('data error');
        }

        // 读取魔法数
        const a0 = this.read_Byte();
        const a1 = this.read_Byte();
        const a2 = this.read_Byte();
        const a3 = this.read_Byte();
        if (a0 != 9 || a1 != 5 || a2 != 2 || a3 != 7) {
            throw new Error('data error');
        }

        // 读取版本
        this.version_h = this.read_I32();
        this.version_l = this.read_I32();
        
        return this;
    },
});
