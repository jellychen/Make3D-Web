/* eslint-disable no-unused-vars */

import isUndefined      from 'lodash/isUndefined';
import isNull           from 'lodash/isNull';
import ConstatnsTexture from './constants-texture';
import Serializer       from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 
     * 写入纹理数据
     * 
     * @param {*} texture 
     * @returns 
     */
    storeTextureBuffer(texture) {
        const buffer = this.scene_texture_collector.getTextureBuffer(texture);
        if (isUndefined(buffer) || isNull(buffer)) {
            return this;
        }

        this.append_Str (texture.uuid, true);
        this.append_Buf (buffer, true);
        this.append_Byte(texture.flipY ? 1 : 0);
        this.append_Byte(ConstatnsTexture.FromThree_ColorSpace (texture.colorSpace));
        this.append_Byte(ConstatnsTexture.FromThree_TextureConf(texture.magFilter));
        this.append_Byte(ConstatnsTexture.FromThree_TextureConf(texture.minFilter));
        this.append_Byte(ConstatnsTexture.FromThree_TextureConf(texture.wrapS));
        this.append_Byte(ConstatnsTexture.FromThree_TextureConf(texture.wrapT));

        return this;
    },

    /**
     * 
     * 写入纹理数据
     * 
     * @param {*} texture 
     * @returns 
     */
    storeTexture(texture) {
        if (texture) {
            this.append_Str(texture.uuid, true);
        } else {
            this.append_Str('', true);
        }
        return this;
    },
});

