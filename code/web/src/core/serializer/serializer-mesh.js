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
     * 存储MESH
     * 
     * @param {*} mesh 
     * @returns 
     */
    *storeMesh(mesh) {
        // 基础的属性
        const name           = mesh.getName();
        const uuid           = mesh.getUUID();
        const visible        = mesh.isVisible();
        const matrix         = mesh.getMatrix(true);
        const children_count = mesh.children.length;
        this.append_I32 (Constants.T_MESH);
        this.append_Str (isString(name)? name: "", true);
        this.append_Str (isString(uuid)? uuid: "", true);
        this.append_Byte(visible? 1: 0);
        this.append_Mat4(matrix);
        this.append_I32 (children_count);

        // 网格
        if (!mesh.geometry) {
            this.append_I32(Constants.T_GEO_NONE);
        } else {
            this.append_I32(Constants.T_GEO);
            const geometry = mesh.geometry;

            // 索引
            if (!geometry.index) {
                this.append_I32(Constants.T_GEO_0_NON_INDEXED);
            } else {
                const buffer = geometry.index.array;
                if (buffer instanceof Uint16Array) {
                    this.append_I32(Constants.T_GEO_0_INDEX_U16);
                } else if (buffer instanceof Uint32Array) {
                    this.append_I32(Constants.T_GEO_0_INDEX_U32);
                }
                this.append_Buf(buffer, true);
            }

            // 位置
            {
                const attr = geometry.attributes.position;
                if (attr && attr.array) {
                    this.append_I32(Constants.T_GEO_0_VERTEX);
                    this.append_Buf(attr.array, true);
                }
            }

            // 颜色
            {
                const attr = geometry.attributes.color;
                if (attr && attr.array) {
                    this.append_I32(Constants.T_GEO_0_COLOR);
                    this.append_Buf(attr.array, true);
                }
            }

            // UV
            {
                const attr = geometry.attributes.uv;
                if (attr && attr.array) {
                    this.append_I32(Constants.T_GEO_0_UV);
                    this.append_Buf(attr.array, true);
                }
            }

            // Normal 
            {
                const attr = geometry.attributes.normal;
                if (attr && attr.array) {
                    this.append_I32(Constants.T_GEO_0_NORMAL);
                    this.append_Buf(attr.array, true);
                }
            }

            // 终止
            this.append_I32(Constants.T_GEO_END);
        }

        // 材质
        if (!mesh.material) {
            this.append_I32(Constants.T_MATERIAL_NONE);
        } else {
            this.storeMaterial(mesh.material);
        }

        // 孩子
        if (children_count > 0) {
            this.append_I32(Constants.T_CHILDREN_BEGIN);
            for (const child of mesh.children) {
                yield* this.storeObject(child);
            }
            this.append_I32(Constants.T_CHILDREN_END);
        }
        
        return this;
    },
});
