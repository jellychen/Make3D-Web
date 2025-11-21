/* eslint-disable no-unused-vars */

import XThree             from '@xthree/basic';
import R                  from './r';
import BuilderTexturePool from './builder-texture-pool';

/**
 * 加载
 */
export default class Builder extends R {
    /**
     * 场景
     */
    scene;
    scene_texture_pool;

    /**
     * 加载状态
     */
    loaded_success = false;

    /**
     * 版本
     */
    version_h = 0;
    version_l = 0;

    /**
     * 场景灯光构建器
     */
    scene_light_creator;

    /**
     * collection
     */
    collection = new Array();

    /**
     * 
     * 构造函数
     * 
     * @param {*} arraybuffer 
     */
    constructor(arraybuffer) {
        super(arraybuffer);
        this.scene_texture_pool = new BuilderTexturePool(this);
    }

    /**
     * 
     * 下一个 i32
     * 
     * @returns 
     */
    next_I32() {
        this.markOffset();
        const i32 = this.read_I32();
        this.resetToMarkOffset();
        return i32;
    }

    /**
     * 
     * 读取 vec3
     * 
     * @param {*} vec3 
     * @returns 
     */
    read_Vec3(vec3) {
        if (this.remaining() < 12) {
            throw new Error('data error');
        }
        vec3.x = this.read_F32();
        vec3.y = this.read_F32();
        vec3.z = this.read_F32();
        return vec3;
    }

    /**
     * 
     * 读取颜色
     * 
     * @param {*} color 
     * @returns 
     */
    read_Color(color) {
        if (this.remaining() < 12) {
            throw new Error('data error');
        }
        color.r = this.read_F32();
        color.g = this.read_F32();
        color.b = this.read_F32();
        return color;
    }

    /**
     * 
     * 读取矩阵
     * 
     * @param {*} mat4 
     * @returns 
     */
    read_Mat4(mat4) {
        if (this.remaining() < 64) {
            throw new Error('data error');
        }
        const eles = mat4.elements;
        for (let i = 0; i < 16; ++i) {
            eles[i] = this.read_F32();
        }
        return mat4;
    }

    /**
     * 
     * 读取一个 I32 并判断
     * 
     * @param {*} data 
     */
    read_I32_AndCheck(data) {
        const i32 = this.read_I32();
        if (data != i32) {
            throw new Error('data error');
        }
    }

    /**
     * 
     * 加载
     * 
     * @returns 
     */
    async load() {
        try {
            
            // 读取元
            this.builderMetadata();

            // 读取纹理池子
            if (!await this.scene_texture_pool.prepareTexture()) {
                return false;
            }
            
            // 构建场景
            return this.builderScene();

        } catch (error) {
            console.error(error);
            
            // 销毁
            for (const mesh of this.collection) {
                mesh.dispose(true, true);
            }
            this.collection.length = 0;
        }

        return false;
    }

    /**
     * 
     * 获取加载成功的场景
     * 
     * 只能调用一次
     * 
     * @returns 
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * 
     * 获取加载的场景后转Group
     * 
     * 只能调用一次
     * 
     * @returns 
     */
    getRootAsGroup() {
        if (!this.scene) {
            return;
        }

        // 把 Scene 转到 Group 中
        const scene   = this.scene;
        const group   = new XThree.Group();
        group.name    = "GroupScene";
        group.visible = scene.visible;
        group.matrix.copy(scene.matrix);
        group.decompose();

        // 先保存全部的孩子
        if (this.scene.children.length > 0) {
            const children = [];
            for (const child of this.scene.children) {
                children.push(child);
            }
            
            this.scene.remove(children);

            for (const child of children) {
                group.add(child);
            }
        }

        return group;
    }

    /**
     * 销毁
     */
    dispose() {
        this.scene_texture_pool.dispose();
    }
}
