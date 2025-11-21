/* eslint-disable no-unused-vars */

import isArray    from 'lodash/isArray';
import XThree     from '@xthree/basic';
import Constants  from './constants';
import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 存储材质，只支持PBR材质
     * 
     * @param {*} material 
     * @returns 
     */
    storeMaterial(material) {
        if (!material.isMeshPhysicalMaterial) {
            throw new console.error("material error");
        }

        this.append_I32  (Constants.T_MATERIAL);
        this.append_Color(material.color);
        this.append_Color(material.emissive);
        this.append_F32  (material.emissiveIntensity);
        this.storeTexture(material.map);
        this.storeTexture(material.normalMap);
        this.storeTexture(material.roughnessMap);
        this.append_F32  (material.metalness);
        this.append_F32  (material.roughness);
        this.append_F32  (material.clearcoat);
        this.append_F32  (material.ior);
        this.append_F32  (material.sheen);
        this.append_Color(material.sheenColor);
        this.append_Color(material.specularColor);
        this.append_F32  (material.thickness);
        this.append_F32  (material.transmission);
        this.append_I32  (Constants.T_MATERIAL_END);

        return this;
    },
});
