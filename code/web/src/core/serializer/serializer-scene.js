/* eslint-disable no-unused-vars */

import isString   from 'lodash/isString';
import Constants  from './constants';
import Serializer from './serializer';

/**
 * Mixin
 */
Object.assign(Serializer.prototype, {
    /**
     * 准备纹理
     */
    async prepareTexture() {
        await this.scene_texture_collector.loadAllTexturesArrayBuffer();
    },

    /**
     * 
     * 存储场景, 异步
     * 
     * @returns 
     */
    *storeScene() {
        const scene          = this.scene;
        const name           = scene.getName();
        const uuid           = scene.getUUID();
        const visible        = scene.isVisible();
        const matrix         = scene.getMatrix(true);
        const children_count = scene.children.length;
        this.append_I32 (Constants.T_SCENE);
        this.append_Str (isString(name)? name: "", true);
        this.append_Str (isString(uuid)? uuid: "", true);
        this.append_Byte(visible? 1: 0);
        this.append_Mat4(matrix);
        this.append_I32 (children_count);

        // 返回场景
        yield scene;

        // 存储孩子
        if (children_count > 0) {
            this.append_I32(Constants.T_CHILDREN_BEGIN);
            for (const child of scene.children) {
                yield* this.storeObject(child);
            }
            this.append_I32(Constants.T_CHILDREN_END);
        }
        
        return this;
    },
});
