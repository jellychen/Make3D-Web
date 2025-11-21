/* eslint-disable no-unused-vars */

import XThree                     from '@xthree/basic';
import W                          from './w';
import Constants                  from './constants';
import SerializerTextureCollector from './serializer-texture-collector';

/**
 * 序列化
 * 
 * 1. 第一步统计全部的纹理，并去重
 * 2. 第二步序列化全部的问题
 * 3. 第三步序列化整个场景，场景的前面是纹理数据集合
 * 
 */
export default class Serializer extends W {
    /**
     * 场景
     */
    scene;
    scene_texture_collector;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        super();
        this.scene = scene;
        this.scene_texture_collector = new SerializerTextureCollector(this.scene);
    }

    /**
     * 
     * 插入
     * 
     * @param {*} vec3 
     * @returns 
     */
    append_Vec3(vec3) {
        this.append_F32(vec3.x);
        this.append_F32(vec3.y);
        this.append_F32(vec3.z);
        return this;
    }

    /**
     * 
     * 插入
     * 
     * @param {*} color 
     * @returns 
     */
    append_Color(color) {
        this.append_F32(color.r);
        this.append_F32(color.g);
        this.append_F32(color.b);
        return this;
    }

    /**
     * 
     * 插入
     * 
     * @param {*} mat4 
     * @returns 
     */
    append_Mat4(mat4) {
        const eles = mat4.elements;
        for (let i = 0; i < 16; ++i) {
            this.append_F32(eles[i]);
        }
        return this;
    }

    /**
     * 
     * 异步函数
     * 
     * @param {*} version_h 
     * @param {*} version_l 
     * @returns 
     */
    *store(version_h = 1, version_l = 1) {
        // 写入元
        this.storeMetadata(version_h, version_l);

        // 写入纹理
        this.append_I32(Constants.T_TEXTURE_DATABASE);
        this.append_I32(this.scene_texture_collector.count());
        this.scene_texture_collector.forEach(texture => {
            this.storeTextureBuffer(texture);
        });
        this.append_I32(Constants.T_TEXTURE_DATABASE_END);

        // 写入场景
        yield* this.storeScene();

        return true;
    }

    /**
     * 
     * 同步生成
     * 
     * @param {*} version_h 
     * @param {*} version_l 
     * @returns 
     */
    storeAsync(version_h = 1, version_l = 1) {
        for (const r of this.store(version_h, version_l)) {
            r;
        }
        return this;
    }

    /**
     * 销毁
     */
    dispose() {
        this.scene = undefined;
        if (this.scene_texture_collector) {
            this.scene_texture_collector.dispose();
            this.scene_texture_collector = undefined;
        }
    }
}
