/* eslint-disable no-unused-vars */

import XThree from '@xthree/basic';

/**
 * 
 * 创建材质
 * 
 * @returns 
 */
function CreateDefaultMaterial() {
    const material = new XThree.MeshPhysicalMaterial();
    material.setColor              (0xEFEFEF);
    material.setRoughness          (1.0);
    material.setMetalness          (0.0);
    material.setEmissiveColor      (0x0);
    material.setEmissiveIntensity  (0);
    material.setAoIntensity        (0);
    material.setClearCoatIntensity (0);
    material.setClearCoatRoughness (0);
    material.setSheen              (0);
    material.setSheenColor         (0x0);
    material.setSheenRoughness     (0);
    material.setSheenRoughness     (1.5);
    material.setThickness          (0);
    material.setTransmission       (0);
    material.setEnvTextureIntensity(0);
    return material;
}

/**
 * 
 * 任何 Threejs 材质转化成PBR材质
 * 
 * 通过对Threejs的加载器分析，以下的材质会被使用
 * 
 * LineBasicMaterial        // 无法转化, 使用默认材质
 * MeshBasicMaterial
 * MeshLambertMaterial
 * MeshPhongMaterial
 * MeshPhysicalMaterial
 * MeshStandardMaterial
 * PointsMaterial           // 无法转化, 使用默认材质
 * SpriteMaterial           // 无法转化, 使用默认材质
 * 
 * @param {*} material 
 * @returns 
 */
export default function Convert(material) {
    // MeshBasicMaterial
    if (material instanceof XThree.MeshBasicMaterial) {
        const m = CreateDefaultMaterial();
        m.color.copy            (material.color);
        m.setColorTexture       (material.map);
        m.setAoTexture          (material.aoMap);
        m.setAoIntensity        (material.aoMapIntensity);
        return m;
    }

    // MeshLambertMaterial
    if (material instanceof XThree.MeshLambertMaterial) {
        const m = CreateDefaultMaterial();
        m.color.copy            (material.color);
        m.setColorTexture       (material.map);
        m.setAoTexture          (material.aoMap);
        m.setAoIntensity        (material.aoMapIntensity);
        m.emissive.copy         (material.emissive);
        m.setEmissiveTexture    (material.emissiveMap);
        m.setEmissiveIntensity  (material.emissiveIntensity);
        m.setNormalTexture      (material.normalMap);
        m.setDisplacementTexture(material.displacementMap);
        m.setSpecularTexture    (material.specularMap);
        return m;
    }

    // MeshPhongMaterial
    if (material instanceof XThree.MeshPhongMaterial) {
        const m = CreateDefaultMaterial();
        m.color.copy            (material.color);
        m.setColorTexture       (material.map);
        m.specularColor.copy    (material.specular);
        m.setSpecularTexture    (material.specularMap);
        m.setAoTexture          (material.aoMap);
        m.setAoIntensity        (material.aoMapIntensity);
        m.emissive.copy         (material.emissive);
        m.setEmissiveTexture    (material.emissiveMap);
        m.setEmissiveIntensity  (material.emissiveIntensity);
        m.setNormalTexture      (material.normalMap);
        m.setDisplacementTexture(material.displacementMap);
        return m;
    }

    // MeshPhysicalMaterial
    if (material instanceof XThree.MeshPhysicalMaterial) {
        return material;
    }

    // MeshStandardMaterial
    if (material instanceof XThree.MeshStandardMaterial) {
        const m = CreateDefaultMaterial();
        m.color.copy            (material.color);
        m.setColorTexture       (material.map);
        m.setMetalness          (material.metalness);
        m.setRoughness          (material.roughness);
        m.emissive.copy         (material.emissive);
        m.setEmissiveTexture    (material.emissiveMap);
        m.setEmissiveIntensity  (material.emissiveIntensity);
        m.setNormalTexture      (material.normalMap);
        m.setDisplacementTexture(material.displacementMap);
        m.setRoughnessMap       (material.roughnessMap);
        m.setMetalnessTexture   (material.metalnessMap);
        return m;
    }

    // 创建默认的材质
    return CreateDefaultMaterial();
}
