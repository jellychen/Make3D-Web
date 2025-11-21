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
    builderMaterial(parent_node) {
        // 获取材质数据是否存在
        const mat_t = this.read_I32();
        if (Constants.T_MATERIAL_NONE == mat_t) {
            parent_node.material = null;
            return this;
        } else if (Constants.T_MATERIAL != mat_t) {
            throw new Error('data error');
        }

        // 创建
        const material = new XThree.MeshPhysicalMaterial();
        
        try {
            // 读取数据
            material.color             = this.read_Color(material.color);
            material.emissive          = this.read_Color(material.emissive);
            material.emissiveIntensity = this.read_F32();
            material.map               = this.builderTexture();
            material.normalMap         = this.builderTexture();
            material.roughnessMap      = this.builderTexture();
            material.metalness         = this.read_F32();
            material.roughness         = this.read_F32();
            material.clearcoat         = this.read_F32();
            material.ior               = this.read_F32();
            material.sheen             = this.read_F32();
            material.sheenColor        = this.read_Color(material.sheenColor);
            material.specularColor     = this.read_Color(material.specularColor);
            material.thickness         = this.read_F32();
            material.transmission      = this.read_F32();

            // 鉴别
            this.read_I32_AndCheck(Constants.T_MATERIAL_END);

            // 设置
            parent_node.setMaterial(material, true);

        } catch (err) {

            if (material) {
                material.__$$_del_ref__();
            }

            throw new Error('data error');
        }

        return this;
    },
});
