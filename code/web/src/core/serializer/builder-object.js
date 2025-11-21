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
     * @param {*} parent_node 
     * @returns 
     */
    builderObject(parent_node) {
        switch (this.next_I32()) {
        case Constants.T_GROUP:
            this.builderGroup(parent_node);
            break;

        case Constants.T_LIGHT_DIR:
        case Constants.T_LIGHT_POINT:
        case Constants.T_LIGHT_SPOT:
            this.builderLight(parent_node);
            break;

        case Constants.T_MESH:
            this.builderMesh(parent_node);
            break;

        case Constants.T_MESH_EDITABLE:
            this.builderMeshEditable(parent_node);
            break;
        }
        
        return this;
    },
});
