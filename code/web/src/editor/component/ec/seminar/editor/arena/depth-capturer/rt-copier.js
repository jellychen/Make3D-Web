/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import MaterialCopy   from '@xthree/material/depth-capture-copy';
import FullScreenRect from '@/core/cinderella/mesh/embedded/full-screen-rect';

/**
 * 没卵用相机
 */
const _empty_camera = new XThree.OrthographicCamera();

/**
 * 拷贝深度
 */
export default class RT_Copier {
    /**
     * 元素
     */
    #mesh = new XThree.Mesh();
    #mesh_material = new MaterialCopy();

    /**
     * 构造函数
     */
    constructor() {
        this.#mesh.geometry = FullScreenRect.getInstance();
        this.#mesh.material = this.#mesh_material;
        this.#mesh.material.blending = XThree.NoBlending;
    }

    /**
     * 
     * 设置深度纹理
     * 
     * @param {*} texture 
     */
    setDepthTexture(texture) {
        this.#mesh_material.setDepthTexture(texture);
        this.#mesh_material.needsUpdate = true;
    }

    /**
     * 
     * 从相机中获取 Near/Far
     * 
     * @param {*} camera 
     */
    setFrustumNearAndFarFromCamera(camera) {
        this.#mesh_material.setFrustumNearAndFar(camera.near, camera.far);
        this.#mesh_material.needsUpdate = true;
    }

    /**
     * 
     * 执行渲染
     * 
     * @param {*} renderer 
     */
    render(renderer) {
        renderer.render(this.#mesh, _empty_camera);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#mesh.dispose(false, true);
    }
}
