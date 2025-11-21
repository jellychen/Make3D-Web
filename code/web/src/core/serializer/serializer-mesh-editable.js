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
     */
    *storeMeshEditable(mesh) {
        // 基础的属性
        const name           = mesh.getName();
        const uuid           = mesh.getUUID();
        const visible        = mesh.isVisible();
        const matrix         = mesh.getMatrix(true);
        const children_count = mesh.children.length;
        this.append_I32 (Constants.T_MESH_EDITABLE);
        this.append_Str (isString(name)? name: "", true);
        this.append_Str (isString(uuid)? uuid: "", true);
        this.append_Byte(visible? 1: 0);
        this.append_Mat4(matrix);
        this.append_I32 (children_count);

        // 获取 Soup
        const soup = mesh.getEditableSoup();
        if (!soup) {
            throw new Error("getEditableSoup error");
        }

        // 点
        {
            const buffer = soup.vertices();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_VERTEX);
                this.append_Buf(buffer, true);
            }
        }

        // 颜色
        {
            const buffer = soup.vertices_color();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_VERTEX_COLOR);
                this.append_Buf(buffer, true);
            }
        }

        // 点uv
        {
            const buffer = soup.vertices_uv();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_UV_0);
                this.append_Buf(buffer, true);
            }
        }

        // 面索引
        {
            const buffer = soup.faces_indices();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_FACE_INDICES);
                this.append_Buf(buffer, true);
            }
        }

        // 面点数
        {
            const buffer = soup.faces_vertices_count();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_FACE_VERTICES_COUNT);
                this.append_Buf(buffer, true);
            }
        }

        // 面uv
        {
            const buffer = soup.faces_vertices_uv();
            if (buffer) {
                this.append_I32(Constants.T_GEO_1_UV_1);
                this.append_Buf(buffer, true);
            }
        }

        // 终止
        this.append_I32(Constants.T_GEO_END);

        // 材质
        if (!mesh.material) {
            this.append_I32(Constants.T_MATERIAL_NONE);
        } else {
            this.storeMaterial(mesh.material);
        }

        // 存储孩子
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
