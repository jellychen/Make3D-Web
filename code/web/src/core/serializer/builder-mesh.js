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
    builderMesh(parent_node) {
        this.read_I32_AndCheck(Constants.T_MESH);

        // 创建
        const mesh = new XThree.Mesh();

        // 添加到收集器
        this.collection.push(mesh);

        // 读取数据
        mesh.name    = this.read_Str();
        mesh.uuid    = this.read_Str();
        mesh.visible = this.read_Byte() == 1;
        mesh.matrix  = this.read_Mat4(mesh.matrix);
        mesh.decompose();

        // 读取孩子数量
        const children_count = this.read_I32();

        // 处理几何
        const geo_t = this.read_I32();

        // 存在几何数据
        if (Constants.T_GEO == geo_t) {

            // 处理索引数据
            const indexed_t = this.read_I32();
            if (Constants.T_GEO_0_NON_INDEXED == indexed_t) {
                ;
            } else if (Constants.T_GEO_0_INDEX_U16 == indexed_t) {
                const buffer = this.read_Buf(false);
                const buffer_u16 = new Uint16Array(buffer);
                mesh.geometry.setIndices16(buffer_u16, true);
            } else if (Constants.T_GEO_0_INDEX_U32 == indexed_t) {
                const buffer = this.read_Buf(false);
                const buffer_u32 = new Uint32Array(buffer);
                mesh.geometry.setIndices32(buffer_u32, true);
            } else  {
                throw new Error('data error');
            }

            // 处理属性数据
            while (true) {
                const attr_t = this.read_I32();
                if (Constants.T_GEO_END == attr_t) {
                    break;
                }

                // 获取数据
                const buffer = this.read_Buf(false);

                // 顶点
                if (Constants.T_GEO_0_VERTEX == attr_t) {
                    const buffer_f32 = new Float32Array(buffer);
                    mesh.geometry.setAttr('position', buffer_f32, 3, true);
                    continue;
                }

                // 颜色
                if (Constants.T_GEO_0_COLOR == attr_t) {
                    const buffer_f32 = new Float32Array(buffer);
                    mesh.geometry.setAttr('color', buffer_f32, 3, true);
                    continue;
                }

                // UV
                if (Constants.T_GEO_0_UV == attr_t) {
                    const buffer_f32 = new Float32Array(buffer);
                    mesh.geometry.setAttr('uv', buffer_f32, 2, true);
                    continue;
                }

                // Normal
                if (Constants.T_GEO_0_NORMAL == attr_t) {
                    const buffer_f32 = new Float32Array(buffer);
                    mesh.geometry.setAttr('normal', buffer_f32, 3, true);
                    continue;
                }
            }
        }

        // 处理材质
        this.builderMaterial(mesh);

        // 处理孩子
        if (children_count > 0) {
            this.read_I32_AndCheck(Constants.T_CHILDREN_BEGIN);
            for (let i = 0; i < children_count; ++i) {
                this.builderObject(mesh);
            }
            this.read_I32_AndCheck(Constants.T_CHILDREN_END);
        }

        // 添加
        parent_node.add(mesh);
        return this;
    },
});
