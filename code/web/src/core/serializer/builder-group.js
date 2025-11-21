/* eslint-disable no-unused-vars */

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
     * @param {*} parent_node 
     * @returns 
     */
    builderGroup(parent_node) {
        this.read_I32_AndCheck(Constants.T_GROUP);

        // 创建
        const group = new XThree.Group();

        // 读取数据
        group.name    = this.read_Str();
        group.uuid    = this.read_Str();
        group.visible = this.read_Byte() == 1;
        group.matrix  = this.read_Mat4(group.matrix);
        group.decompose();

        // 读取孩子
        const children_count = this.read_I32();
        if (children_count > 0) {
            this.read_I32_AndCheck(Constants.T_CHILDREN_BEGIN);
            for (let i = 0; i < children_count; ++i) {
                this.builderObject(group);
            }
            this.read_I32_AndCheck(Constants.T_CHILDREN_END);
        }

        // 添加
        parent_node.add(group);

        return this;
    },
});
