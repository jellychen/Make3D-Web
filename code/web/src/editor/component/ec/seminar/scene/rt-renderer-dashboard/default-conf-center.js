/* eslint-disable no-unused-vars */

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import XThree         from '@xthree/basic';
import DefaultConf    from "./default-conf";

/**
 * 默认的配置
 */
class DefaultConfCenter {
    /**
     * 数据
     */
    ibl_thumb_url;                  // 微缩图的地址
    ibl_texture;                    // IBL数据
    ibl_texture_url;                // IBL数据地址
    ibl_intensity          = 1.5;   // IBL的能量
    bounces                = 6;     // 弹跳
    tiled                  = false; // 分块渲染器
    background_transparent = true;  // 背景透明
    sample_count           = 100;   // 采样次数
    denoise                = false; // 开启降噪

    /**
     * 构造函数
     */
    constructor() {
        this.ibl_thumb_url = DefaultConf.default_hdr_thumb;
        this.ibl_texture_url  = DefaultConf.default_hdr;
    }

    /**
     * 异步加载
     */
    async loadEnvMap() {
        if (!this.ibl_texture) {
            const loader = new RGBELoader().setDataType(XThree.FloatType);
            this.ibl_texture = (await loader.loadAsync(this.ibl_texture_url));
        }
        return this.ibl_texture;
    }
}

export default new DefaultConfCenter();
