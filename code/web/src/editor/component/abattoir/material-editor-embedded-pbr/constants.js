/* eslint-disable no-unused-vars */

import IMG_PBR_Default          from './icon/default.png';
import IMG_PBR_Glossy_Plastic   from './icon/glossy.plastic.png';
import IMG_PBR_Rough_Plastic    from './icon/rough.plastic.png';
import IMG_PBR_Glossy_Metal     from './icon/glossy.metal.png';
import IMG_PBR_Rough_Metal      from './icon/rough.metal.png';
import IMG_PBR_Glossy_Glass     from './icon/glossy.glass.png';
import IMG_PBR_Rough_Glass      from './icon/rough.glass.png';
import IMG_PBR_Empty_Glass      from './icon/empty.glass.png';
import IMG_PBR_Empty_Mirror     from './icon/mirror.png';
import IMG_PBR_Emissive         from './icon/emissive.png';

const KEY_DISPLACEMENT_TEXTURE          = 'displacement-texture';
const KEY_DISPLACEMENT_SCALE            = 'displacement-scale';
const KEY_DISPLACEMENT_BIAS             = 'displacement-bias';
const KEY_COLOR                         = 'color';
const KEY_COLOR_TEXTURE                 = 'color-texture';
const KEY_SPECULAR_COLOR                = 'specular-color';
const KEY_SPECULAR_COLOR_TEXTURE        = 'specular-color-texture';
const KEY_EMISSIVE_COLOR                = 'emissive-color';
const KEY_EMISSIVE_TEXTURE              = 'emissive-texture';
const KEY_EMISSIVE_INTENSITY            = 'emissive-intensity';
const KEY_NORMAL_TEXTURE                = 'normal-texture';
const KEY_NORMAL_TEXTURE_SPACE          = 'normal-texture-space';
const KEY_NORMAL_SCALE                  = 'normal-scale';
const KEY_AO_TEXTURE                    = 'ao-texture';
const KEY_AO_INTENSITY                  = 'ao-intensity';
const KEY_METALNESS                     = 'metalness';
const KEY_METALNESS_TEXTURE             = 'metalness-texture';
const KEY_ROUGHNESS                     = 'roughness';
const KEY_ROUGHNESS_TEXTURE             = 'roughness-texture';
const KEY_CLEARCOAT                     = 'clearcoat';
const KEY_CLEARCOAT_ROUGHNESS           = 'clearcoat-roughness';
const KEY_CLEARCOAT_ROUGHNESS_TEXTURE   = 'clearcoat-roughness-texture';
const KEY_CLEARCOAT_NORMAL_TEXTURE      = 'clearcoat-normal-texture';
const KEY_CLEARCOAT_NORMAL_SCALE_X      = 'clearcoat-normal-scale-x';
const KEY_CLEARCOAT_NORMAL_SCALE_Y      = 'clearcoat-normal-scale-y';
const KEY_SHEEN                         = 'sheen';
const KEY_SHEEN_COLOR                   = 'sheen-color';
const KEY_SHEEN_COLOR_TEXTURE           = 'sheen-color-texture';
const KEY_SHEEN_ROUGHNESS               = 'sheen-roughness';
const KEY_SHEEN_ROUGHNESS_TEXTURE       = 'sheen-roughness-texture';
const KEY_IOR                           = 'ior';
const KEY_THICKNESS                     = 'thickness';
const KEY_THICKNESS_TEXTURE             = 'thickness-texture';
const KEY_TRANSMISSION                  = 'transmission';
const KEY_TRANSMISSION_TEXTURE          = 'transmission-texture';

/**
 * 
 */
export default [
    {
        name : "Default",
        image: IMG_PBR_Default,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0.5;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Glossy Plastic",
        image: IMG_PBR_Glossy_Plastic,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Rough Plastic",
        image: IMG_PBR_Rough_Plastic,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0.3;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Glossy Metal",
        image: IMG_PBR_Glossy_Metal,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 1;
            material.roughness         = 0;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Rough Metal",
        image: IMG_PBR_Rough_Metal,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 1;
            material.roughness         = 0.3;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Glossy Glass",
        image: IMG_PBR_Glossy_Glass,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 1;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Rough Glass",
        image: IMG_PBR_Rough_Glass,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0.1;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 1;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Empty Glass",
        image: IMG_PBR_Empty_Glass,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 0;
            material.roughness         = 0;
            material.clearcoat         = 0;
            material.ior               = 2;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 1;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Mirror",
        image: IMG_PBR_Empty_Mirror,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 1;
            material.metalness         = 1;
            material.roughness         = 0;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },

    {
        name : "Emissive",
        image: IMG_PBR_Emissive,
        attach(material) {
            material.emissive          .setHex(0x0);
            material.emissiveIntensity = 2;
            material.metalness         = 1;
            material.roughness         = 0.5;
            material.clearcoat         = 0;
            material.ior               = 1.5;
            material.sheen             = 0;
            material.sheenColor        .setHex(0x0);
            material.specularColor     .setHex(0x0);
            material.thickness         = 0;
            material.transmission      = 0;
            material.needsUpdate       = true;
        },
    },
]
