
import XThree from '@xthree/basic';

// 一些默认的参数
export default {
    UNKNOWN                         : 0,
    NearestFilter                   : 1,
    LinearFilter                    : 2,
    NearestMipmapNearestFilter      : 3,
    LinearMipmapNearestFilter       : 4,
    NearestMipmapLinearFilter       : 5,
    LinearMipmapLinearFilter        : 6,
    ClampToEdgeWrapping             : 7,
    MirroredRepeatWrapping          : 8,
    RepeatWrapping                  : 9,

    ColorSpaceNone                  : 0,
    ColorSpaceSRGB                  : 1,
    ColorSpaceSRGBLinear            : 2,

    /**
     * 
     * 转 Three 的数据
     * 
     * @param {*} value 
     * @param {*} default_value 
     * @returns 
     */
    ToThree_TextureConf(value, default_value = XThree.NearestFilter) {
        switch(value) {
        case this.NearestFilter:
            return XThree.NearestFilter;
        case this.LinearFilter:
            return XThree.LinearFilter;
        case this.NearestMipmapNearestFilter:
            return XThree.NearestMipmapNearestFilter;
        case this.LinearMipmapNearestFilter:
            return XThree.LinearMipmapNearestFilter;
        case this.NearestMipmapLinearFilter:
            return XThree.NearestMipmapLinearFilter;
        case this.LinearMipmapLinearFilter:
            return XThree.LinearMipmapLinearFilter;
        case this.ClampToEdgeWrapping:
            return XThree.ClampToEdgeWrapping;
        case this.MirroredRepeatWrapping:
            return XThree.MirroredRepeatWrapping;
        case this.RepeatWrapping:
            return XThree.RepeatWrapping;
        default:
            return default_value;
        }
    },

    /**
     * 
     * 转 Three 的数据
     * 
     * @param {*} value 
     * @param {*} default_value 
     * @returns 
     */
    ToThree_ColorSpace(value, default_value = '') {
        switch(value) {
        case this.ColorSpaceNone:
            return '';
        case this.ColorSpaceSRGB:
            return 'srgb';
        case this.ColorSpaceSRGBLinear:
            return 'srgb-linear';
        default:
            return default_value;
        }
    },

    /**
     * 
     * 从Threejs中获取
     * 
     * @param {*} value 
     * @returns 
     */
    FromThree_TextureConf(value) {
        switch(value) {
        case XThree.NearestFilter:
            return this.NearestFilter;
        case XThree.LinearFilter:
            return this.LinearFilter;
        case XThree.NearestMipmapNearestFilter:
            return this.NearestMipmapNearestFilter;
        case XThree.LinearMipmapNearestFilter:
            return this.LinearMipmapNearestFilter;
        case XThree.NearestMipmapLinearFilter:
            return this.NearestMipmapLinearFilter;
        case XThree.LinearMipmapLinearFilter:
            return this.LinearMipmapLinearFilter;
        case XThree.ClampToEdgeWrapping:
            return this.ClampToEdgeWrapping;
        case XThree.MirroredRepeatWrapping:
            return this.MirroredRepeatWrapping;
        case XThree.RepeatWrapping:
            return this.RepeatWrapping;
        default:
            return this.UNKNOWN;;
        }
    },

    /**
     * 
     * 从Threejs中获取
     * 
     * @param {*} value 
     * @returns 
     */
    FromThree_ColorSpace(value) {
        switch(value) {
        case 'srgb':
            return this.ColorSpaceSRGB;
        case 'srgb-linear':
            return this.ColorSpaceSRGBLinear;
        }
    },
}
