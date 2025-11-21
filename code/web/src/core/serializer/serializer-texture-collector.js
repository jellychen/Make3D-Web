/* eslint-disable no-unused-vars */

import isArray       from 'lodash/isArray';
import isUndefined   from 'lodash/isUndefined';
import ToArrayBuffer from '@core/misc/texture-to-arraybuffer';
import XThree        from '@xthree/basic';

/**
 * 统计全部的
 */
export default class SerializerTextureCollector {
    /**
     * 场景
     */
    #scene;

    /**
     * 所有的纹理
     */
    #textures = new Map();

    /**
     * 存储每个纹理的数据
     */
    #textures_arraybuffer = new Map();

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        this.#scene = scene;
        this.#scene.traverse(object => {
            if (!object.isMesh) {
                return;
            }

            const material = object.material;
            if (isUndefined(material)) {
                return;
            }

            if (isArray(material)) {
                for (const m of material) {
                    this.#appendMaterial(m);
                }
            } else {
                this.#appendMaterial(material);
            }
        }, false);
    }

    /**
     * 
     * 收集材质
     * 
     * @param {*} material 
     */
    #appendMaterial(material) {
        for (const key in material) {
            const v = material[key];
            if (v && v instanceof XThree.Texture) {
                const uuid = v.uuid;
                if (this.#textures.has(uuid)) {
                    continue;
                } else {
                    v.__$$_add_ref__();
                    this.#textures.set(uuid, v);
                }
            }
        }
    }

    /**
     * 
     * 判空
     * 
     * @returns 
     */
    empty() {
        return this.#textures.size > 0;
    }

    /**
     * 
     * 获取数量
     * 
     * @returns 
     */
    count() {
        return this.#textures.size;
    }

    /**
     * 
     * 遍历
     * 
     * @param  {...any} args 
     */
    forEach(...args) {
        this.#textures.forEach(...args);
    }

    /**
     * 加载所有纹理的数据
     */
    async loadAllTexturesArrayBuffer() {
        for (const texture of this.#textures.values()) {
            const uuid = texture.uuid;
            const buffer = await ToArrayBuffer(texture, 'image/jpeg', true);
            this.#textures_arraybuffer.set(uuid, buffer);
        }
    }

    /**
     * 
     * 是否存在
     * 
     * @param {*} texture 
     * @returns 
     */
    has(texture) {
        return this.#textures.has(texture.uuid);
    }

    /**
     * 
     * 获取指定纹理的数据
     * 
     * @param {*} texture 
     * @returns 
     */
    getTextureBuffer(texture) {
        return this.#textures_arraybuffer.get(texture.uuid);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#textures.forEach(texture => {
            texture.__$$_del_ref__();
        });
        this.#textures.clear();
        this.#textures_arraybuffer.clear();
    }
}
