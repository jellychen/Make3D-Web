/* eslint-disable no-unused-vars */

import XThree       from '@xthree/basic';
import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
import MeshFromSoup from '@core/misc/mesh-from-soup';
import Constants    from './constants';
import Builder      from './builder';

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
    builderMeshEditable(parent_node) {
        this.read_I32_AndCheck(Constants.T_MESH_EDITABLE);

        // 获取感兴趣的类
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoup,
        } = Chameleon;

        // 创建
        const mesh = new EditableMesh();

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

        // 构建 Soup
        const soup = GeoSolidSoup.MakeShared();

        // 读取 Soup 的属性
        while (true) {
            const attr_t = this.read_I32();
            if (Constants.T_GEO_END == attr_t) {
                break;
            }

            // 点
            if (Constants.T_GEO_1_VERTEX == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setVerticesBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }

            // 点颜色
            if (Constants.T_GEO_1_VERTEX_COLOR == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setVerticesColorBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }

            // 点UV
            if (Constants.T_GEO_1_UV_0 == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setVerticesUVBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }

            // 面索引
            if (Constants.T_GEO_1_FACE_INDICES == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setFacesIndicesBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }

            // 面点数
            if (Constants.T_GEO_1_FACE_VERTICES_COUNT == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setFacesVerticesCountBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }

            // 面uv
            if (Constants.T_GEO_1_UV_1 == attr_t) {
                const buffer = this.readArrayBufferAsRawBuffer();
                if (buffer) {
                    soup.setFacesVerticesUVBuffer(buffer.getPtr());
                    buffer.delete();
                }
                continue;
            }
        }

        // 配置 mesh
        MeshFromSoup(mesh, soup);

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
