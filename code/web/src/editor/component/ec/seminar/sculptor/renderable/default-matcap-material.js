/* eslint-disable no-unused-vars */

import XThree           from '@xthree/basic';
import IMG_DATA_DEFAULT from './default-matcap-material-texture.base64';
import isFunction       from 'lodash/isFunction';

/**
 * 数据
 */
const loader   = new XThree.TextureLoader();
const material = new XThree.MeshMatcapMaterial();
material.color = new XThree.Color(0xAFAFAF);

/**
 * 
 * 加载材质
 * 
 * @param {*} on_success 
 */
export default {
    /**
     * 
     * 执行
     * 
     * @param {*} on_finish 
     */
    init(on_finish) {
        material.matcap = loader.load(IMG_DATA_DEFAULT, () => {
            material.matcap.encoding = XThree.SRGBColorSpace;
            if (isFunction(on_finish)) {
                on_finish();
            }
        });
    },

    /**
     * 
     * 获取
     * 
     * @returns 
     */
    getMaterial() {
        return material;
    }
}

