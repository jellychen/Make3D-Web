/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 默认参数
 */
const DEFAULT_COLOR              = 0x848484;
const DEFAULT_MATERIAL_ROUGHNESS = 0.5;
const DEFAULT_MATERIAL_METALNESS = 0.0;
const DEFAULT_EMISSIVE_COLOR     = 0x000000;
const DEFAULT_SHEEN_COLOR        = 0x000000;
const DEFAULT_IOR                = 2;

/**
 * 获取默认的材质
 */
export default function() {
    const material = new XThree.MeshPhysicalMaterial();
    material.setColor              (DEFAULT_COLOR);
    material.setRoughness          (DEFAULT_MATERIAL_ROUGHNESS);
    material.setMetalness          (DEFAULT_MATERIAL_METALNESS);
    material.setEmissiveColor      (DEFAULT_EMISSIVE_COLOR);
    material.setEmissiveIntensity  (0);
    material.setAoIntensity        (0);
    material.setClearCoatIntensity (0);
    material.setClearCoatRoughness (0);
    material.setSheen              (0);
    material.setSheenColor         (DEFAULT_SHEEN_COLOR);
    material.setSheenRoughness     (0);
    material.setIOR                (DEFAULT_IOR);
    material.setThickness          (0);
    material.setTransmission       (0);
    material.setEnvTextureIntensity(0);
    
    material.side = XThree.DoubleSide;

    return material;
}
