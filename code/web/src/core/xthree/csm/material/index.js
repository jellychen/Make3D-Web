/* eslint-disable no-unused-vars */

import * as THREE from 'three';
import Patch      from '../patch';

/**
 * 基础材质
 */
const BTM = new THREE.MeshPhysicalMaterial();

/**
 * 可以自定义的材质
 */
export default class CSM_Material extends THREE.Material {
    /**
     * 层
     */
    #layer_cluster;

    /**
     * 材质定义
     */
    #defines          = {};
    #uniforms         = {};
    #uniforms_declare = '';
    #vs_before_main   = '';
    #vs_body          = '';
    #fs_before_main   = '';
    #fs_body          = '';
    #cache_key        = 0;

    /**
     * 标记
     */
    #version          = 0;

    /**
     * 表示这是一个自定义的材质
     */
    get isCSM() {
        return true;
    }

    /**
     * 获取
     */
    get uniforms() {
        return this.#uniforms;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} layer_cluster 
     */
    constructor(layer_cluster) {
        super();
        this.#layer_cluster = layer_cluster;

        //
        // 伪装成 MeshPhysicalMaterial
        //
        Object.assign(this, BTM);
        const getters_setters = Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(BTM)
        );

        for (const key in getters_setters) {
            const desc = getters_setters[key];
            if (desc.get || desc.set) {
                Object.defineProperty(this, key, desc);
            }
        }

        //
        // Override type setter
        //
        Object.defineProperty(this, "type", {
            /**
             * 
             * 获取
             * 
             * @returns 
             */
            get() {
                return BTM.type;
            },

            /**
             * 
             * 设置
             * 
             * @param {*} value 
             */
            set(value) {
                BTM.type = value;
            },
        });
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} conf 
     */
    setup(conf) {
        this.#defines          = conf.defines           || {};
        this.#uniforms         = conf.uniforms          || {};
        this.#uniforms_declare = conf.uniforms_declare  || '';
        this.#vs_before_main   = conf.vs_before_main    || '';
        this.#vs_body          = conf.vs                || '';
        this.#fs_before_main   = conf.fs_before_main    || '';
        this.#fs_body          = conf.fs                || '';
        this.#cache_key        = conf.cache_key;
    }

    /**
     * 
     * 复写
     * 
     * @param {*} shader_object 
     * @param {*} renderer 
     */
    onBeforeCompile(shader_object, renderer) {
        //
        // 收集数据
        //
        const requirement = {
            vs: {},
            fs: {},
        };
        this.#layer_cluster.rebuild(requirement);

        //
        // uniforms
        //
        shader_object.uniforms = {
            ...shader_object.uniforms,
            ...this.#uniforms
        };

        //
        // 处理VS
        //
        {   
            const vs = shader_object.vertexShader;
            const context = {
                defines         : this.#defines,
                uniforms_declare: this.#uniforms_declare,
                before_main     : this.#vs_before_main,
                body            : this.#vs_body,
                requirement     : requirement.vs,
            };
            shader_object.vertexShader = Patch.VS_Patch(vs, context);
            console.log(shader_object.vertexShader);
        }

        //
        // 处理FS
        //
        {
            const fs = shader_object.fragmentShader;
            const context = {
                defines         : this.#defines,
                uniforms_declare: this.#uniforms_declare,
                before_main     : this.#fs_before_main,
                body            : this.#fs_body,
                requirement     : requirement.fs,
            };
            shader_object.fragmentShader = Patch.FS_Patch(fs, context);
        }
    }

    /**
     * 
     * 计算Cache的Key
     * 
     * @returns 
     */
    customProgramCacheKey() {
        const a = this.#cache_key;
        const b = this.#version;
        return `${a}/${b}`;
    }

    /**
     * 标记需要重新构建
     */
    markNeedRebuild() {
        this.#version++;
        this.needsUpdate = true;
    }
}

