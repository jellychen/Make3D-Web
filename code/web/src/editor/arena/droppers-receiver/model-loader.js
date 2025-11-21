/* eslint-disable no-unused-vars */

import isFunction             from 'lodash/isFunction';
import isUndefined            from 'lodash/isUndefined';
import Loader                 from '@core/cinderella/loader/loader';
import TraverseMaterialBarber from '@/core/cinderella/material/barber-traverse';

/**
 * 加载模型
 */
export default class ModelLoader {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 场景
     */
    #scene;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} scene 
     */
    constructor(coordinator, scene) {
        this.#coordinator = coordinator;
        this.#scene = scene;
    }

    /**
     * 
     * 合规
     * 
     * @param {*} object 
     */
    #compliance(object) {
        //
        // 移除全部的灯光和相机
        //
        try {
            object.traverse(e => {
                if (!e.isLight && !e.isCamera) {
                    return;
                }
                e.traverse(object => {
                    if (isFunction(object.dispose)) {
                        object.dispose(true, true);
                    }
                });
                e.removeFromParent();
            }, true);
        } catch(e) {
            console.error(e);
        }

        //
        // 考虑到Threejs加载器的坐标系的差异
        //
        // 绕X轴逆时针旋转 90
        //
        object.rotateX(Math.D2A_(90));

        //
        // 更新uuid
        //
        object.updateUUID();
        
        //
        // 对材质做检测和转化
        //
        TraverseMaterialBarber(object);
    }

    /**
     * 
     * 加载
     * 
     * @param {*} file 
     */
    load_OBJ(file) {
        Loader.loadObjectData(file, object => {
            if (!object) {
                return;
            } else {
                object.setFolded(true);
                object.markExternalImport(true);
            }

            this.#compliance(object);
            this.#scene.add(object);
            this.#coordinator.markTreeViewNeedUpdate(true);
            this.#coordinator.renderNextFrame();
        });
    }

    /**
     * 
     * 加载
     * 
     * @param {*} file 
     */
    load_STL(file) {
        Loader.loadStlData(file, object => {
            if (!object) {
                return;
            } else {
                object.setFolded(true);
                object.markExternalImport(true);
            }

            this.#compliance(object);
            this.#scene.add(object);
            this.#coordinator.markTreeViewNeedUpdate(true);
            this.#coordinator.renderNextFrame();
        });
    }

    /**
     * 
     * 加载
     * 
     * @param {*} file 
     */
    load_FBX(file) {
        Loader.loadFbxData(file, object => {
            if (!object) {
                return;
            } else {
                object.setFolded(true);
                object.markExternalImport(true);
            }

            this.#compliance(object);
            this.#scene.add(object);
            this.#coordinator.markTreeViewNeedUpdate(true);
            this.#coordinator.renderNextFrame();
        });
    }

    /**
     * 
     * 加载
     * 
     * @param {*} file 
     */
    load_GLTF_GLB(file) {
        Loader.loadGLTFData(file, object => {
            if (isUndefined(object.scene)) {
                return;
            }

            //
            // tips:
            //
            // 这里尽管是scene，其实类型是Group
            //
            const scene = object.scene;
            try {
                this.#compliance(scene);
            } catch(e) {
                console.error(e);
            }

            this.#scene.add(scene);
            this.#coordinator.markTreeViewNeedUpdate(true);
            this.#coordinator.renderNextFrame();
        });
    }
}
