/* eslint-disable no-unused-vars */

import XThree            from '@xthree/basic';
import GlobalScope       from '@common/global-scope';
import GeometryTris      from '@core/misc/geometry-tris';
import SceneSelectedTree from '../scene-selected-tree';

/**
 * 用来对scene进行流形修复
 */
export default class Convert {
    /**
     * 当前的场景
     */
    #coordinator;
    #coordinator_mesh_arr;

    /**
     * 新的场景
     */
    #scene;

    /**
     * 获取
     */
    get scene() {
        return this.#scene;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 
     * 统计
     * 
     * @param {*} selected_only 
     * @returns 
     */
    statistics(selected_only = false) {
        this.#coordinator_mesh_arr = [];
        this.#coordinator.scene.updateMatrixWorld();

        const traverse = object => {
            if (!object.visible) {
                return;
            }

            if (object.isMesh) {
                this.#coordinator_mesh_arr.push(object);
            }

            for (const child of object.children) {
                traverse(child);
            }
        };

        if (selected_only) {
            const container = this.#coordinator.selected_container;
            for (const root of container.all()) {
                traverse(root);
            }
        } else {
            traverse(this.#coordinator.scene);
        }
        return this.#coordinator_mesh_arr.length;
    }

    /**
     * 处理
     */
    *process() {
        this.#scene = new XThree.Scene();
        for (const mesh of this.#coordinator_mesh_arr) {
            const new_mesh = this.#checkMeshManifold(mesh);
            if (new_mesh) {
                this.#scene.add(new_mesh);
            }
            yield mesh;
        }
    }

    /**
     * 
     * 检查一个Mesh的流型
     * 
     * @param {*} mesh 
     * @returns 
     */
    #checkMeshManifold(mesh) {
        const Chameleon = GlobalScope.Chameleon;
        const {
            GeoSolidSoupTriangulator,
        } = Chameleon;

        //
        // 更新
        mesh.updateMatrixWorld(true);

        //
        //
        // 新建
        //
        const new_mesh = new XThree.Mesh();
        new_mesh.position.setFromMatrixPosition(mesh.matrixWorld);
        new_mesh.quaternion.setFromRotationMatrix(mesh.matrixWorld);
        new_mesh.scale.setFromMatrixScale(mesh.matrixWorld);

        //
        // 如果有Soup，那么Soup直接三角化
        //
        if (mesh.isEditableMesh) {
            const soup = mesh.getEditableSoup();
            if (!soup) {
                return;
            }
            const indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());
            new_mesh.geometry.setAttr('position', soup.vertices(), 3, true);
            new_mesh.geometry.setIndices32(indices, true);
        }

        //
        // 如果是普通的Mesh
        //
        else if (mesh.geometry) {
            const tris = GeometryTris(mesh.geometry);
            if (!tris) {
                return;
            }

            const soup = tris.fix_manifold_and_to_soup();
            tris.delete();
            if (!soup) {
                return;
            }
            const indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());
            new_mesh.geometry.setAttr('position', soup.vertices(), 3, true);
            new_mesh.geometry.setIndices32(indices, true);
        }

        return new_mesh;
    }
}

