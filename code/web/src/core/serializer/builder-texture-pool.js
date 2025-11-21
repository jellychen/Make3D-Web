/* eslint-disable no-unused-vars */

import isString         from 'lodash/isString';
import XThree           from '@xthree/basic';
import ConstatnsTexture from './constants-texture';
import LoaderTexture    from '@core/cinderella/loader/loader-texture';
import Constants        from './constants';

/**
 * 纹理池
 */
export default class BuilderTexturePool {
    /**
     * 构建
     */
    #builder;

    /**
     * textures
     */
    #textures = new Map();

    /**
     * 
     * 构造函数
     * 
     * @param {*} builder 
     */
    constructor(builder) {
        this.#builder = builder;
    }
    
    /**
     * 
     * @param {*} uuid 
     */
    getTexture(uuid) {
        if (isString(uuid)) {
            return this.#textures.get(uuid);
        }
    }

    /**
     * 获取
     */
    async prepareTexture() {
        const builder = this.#builder;

        // 检测
        builder.read_I32_AndCheck(Constants.T_TEXTURE_DATABASE);

        // 读取纹理的数量
        const textures_count = builder.read_I32();

        // 依次读取
        for (let i = 0; i < textures_count; ++i) {
            const uuid   = builder.read_Str();
            const buffer = builder.read_Buf(false);

            try {
                const texture = await LoaderTexture.fromArrayBuffer(buffer);
                if (texture && texture instanceof XThree.Texture) {
                    texture.__$$_add_ref__();
                    this.#textures.set(uuid, texture);
                }

                texture.flipY      = 1 == builder.read_Byte();
                texture.colorSpace = ConstatnsTexture.ToThree_ColorSpace (builder.read_Byte());
                texture.magFilter  = ConstatnsTexture.ToThree_TextureConf(builder.read_Byte());
                texture.minFilter  = ConstatnsTexture.ToThree_TextureConf(builder.read_Byte());
                texture.wrapS      = ConstatnsTexture.ToThree_TextureConf(builder.read_Byte());
                texture.wrapT      = ConstatnsTexture.ToThree_TextureConf(builder.read_Byte());
            } catch (error) {
                console.error(error);
            }
        }

        // 检测
        builder.read_I32_AndCheck(Constants.T_TEXTURE_DATABASE_END);

        return true;
    }

    /**
     * 销毁
     */
    dispose() {
        this.#textures.forEach(texture => {
            texture.__$$_del_ref__();
        });
        this.#textures.clear;
    }
}