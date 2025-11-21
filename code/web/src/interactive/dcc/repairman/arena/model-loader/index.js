/* eslint-disable no-unused-vars */

import XThree      from '@xthree/basic';
import ModelLoader from './loader';

/**
 * 统一的加载器
 */
export default class Loader {
    /**
     * 场景
     */
    #scene;

    /**
     * 获取
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 构造函数
     */
    constructor() {
        this.#scene = new XThree.Scene();
    }

    /**
     * 
     * 添加
     * 
     * @param {*} file 
     * @param {*} callback 
     * @returns 
     */
    addFile(file, callback) {
        const name = file.name;
        const extension = name.substring(name.lastIndexOf(".") + 1);
        const ext = extension.toLowerCase();
        callback = callback || (() => {});
        switch (ext) {
        case 'obj':
            return this.#addFile_OBJ(file, callback);
        case 'stl':
            return this.#addFile_STL(file, callback);
        case 'fbx':
            return this.#addFile_FBX(file, callback);
        case 'gltf':
        case 'glb':
            return this.#addFile_GLTF_GLB(file, callback);
        }
    }

    /**
     * 
     * 获取
     * 
     * @returns
     */
    #getScene() {
        return this.#scene;
    }

    /**
     * 
     * 添加 OBJ
     * 
     * @param {*} file 
     * @param {*} callback
     */
    #addFile_OBJ(file, callback) {
        ModelLoader.loadObjectData(file, object=> {
            if (object) {
                this.#getScene().add(object);
            }
            callback();
        });
    }

    /**
     * 
     * 添加 STL
     * 
     * @param {*} file 
     * @param {*} callback
     */
    #addFile_STL(file, callback) {
        ModelLoader.loadStlData(file, object=> {
            if (object) {
                this.#getScene().add(object);
            }
            callback();
        });
    }

    /**
     * 
     * 添加 FBX
     * 
     * @param {*} file 
     * @param {*} callback
     */
    #addFile_FBX(file, callback) {
        ModelLoader.loadFbxData(file, object=> {
            if (object) {
                this.#getScene().add(object);
            }
            callback();
        });
    }

    /**
     * 
     * 添加 GLB/GLTF
     * 
     * @param {*} file 
     * @param {*} callback
     */
    #addFile_GLTF_GLB(file, callback) {
        ModelLoader.loadGLTFData(file, object=> {
            if (!object || !object.scene) {
                return;
            }
            const scene = this.#getScene();
            const children = object.scene.children;
            for (const child of children) {
                scene.add(child);
            }
            callback();
        });
    }
}
