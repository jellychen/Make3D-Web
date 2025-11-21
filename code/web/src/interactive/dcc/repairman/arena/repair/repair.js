/* eslint-disable no-unused-vars */

import XThree     from '@xthree/basic';
import RepairMesh from './repair-mesh';

/**
 * 对整个Scene进行修复
 */
export default class Repair {
    /**
     * 需要被修复的网格
     */
    #meshes = [];

    /**
     * 修复后的场景
     */
    #scene;

    /**
     * 获取
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 获取
     */
    get count() {
        return this.#meshes.length;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     */
    constructor(scene) {
        scene.updateMatrixWorld();
        scene.traverse(child => {
            if (child.isMesh) {
                this.#meshes.push(child);
            }
        }, false);
    }

    /**
     * 处理
     */
    *process() {
        this.#scene = new XThree.Scene();
        for (const mesh of this.#meshes) {
            const new_mesh = RepairMesh(mesh);
            if (new_mesh) {
                this.#scene.add(new_mesh);
            }
            yield mesh;
        }
    }
}
