/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import XThree         from '@xthree/basic';
import XThreeMaterial from '@xthree/material';
import FullScreenRect from '../mesh/embedded/full-screen-rect';

/**
 * 做像素拷贝
 */
export default class Copy {
    /**
     * 渲染器
     */
    #renderer;

    /**
     * 没卵用相机
     */
    #camera = new XThree.OrthographicCamera();

    /**
     * 用来渲染的MESH
     */
    #mesh;
    #mesh_material;

    /**
     * 
     * 构造函数
     * 
     * @param {*} renderer 
     */
    constructor(renderer) {
        this.#renderer               = renderer;
        this.#mesh                   = new XThree.Mesh();
        this.#mesh.geometry          = FullScreenRect.getInstance();
        this.#mesh_material          = new XThreeMaterial.Copy();
        this.#mesh.material          = this.#mesh_material;
        this.#mesh.material.blending = XThree.NoBlending;
    }

    /**
     * 
     * 设置纹理
     * 
     * @param {*} texture 
     */
    setTexture(texture) {
        this.#mesh_material.uniforms.tDiffuse.value = texture;
    }

    /**
     * 渲染
     */
    render() {
        this.#renderer.render(this.#mesh, this.#camera);
    }

    /**
     * 销毁
     */
    dispose() {
        this.#mesh.dispose(false, true);
    }
}
