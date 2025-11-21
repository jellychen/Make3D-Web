/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import Constants  from './constants';
import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储集合
     * 
     * @param {*} group 
     * @returns 
     */
    *storeGroup(group) {
        // 自己的属性
        const name           = group.getName();
        const uuid           = group.getUUID();
        const visible        = group.isVisible();
        const matrix         = group.getMatrix(true);
        const children_count = group.children.length;
        this.append_I32 (Constants.T_GROUP);
        this.append_Str (isString(name)? name: "", true);
        this.append_Str (isString(uuid)? uuid: "", true);
        this.append_Byte(visible? 1: 0);
        this.append_Mat4(matrix);
        this.append_I32 (children_count);

        // 存储孩子
        if (children_count > 0) {
            this.append_I32(Constants.T_CHILDREN_BEGIN);
            for (const child of group.children) {
                yield* this.storeObject(child);
            }
            this.append_I32(Constants.T_CHILDREN_END);
        }
        
        return this;
    },
});
