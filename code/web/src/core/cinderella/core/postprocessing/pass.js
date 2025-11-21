
import isFunction     from 'lodash/isFunction';
import XThree         from '@xthree/basic';
import FullScreenRect from '../../mesh/embedded/full-screen-rect';

/**
 * Pass
 */
export default class Pass {
    /**
     * 网格
     */
    #mesh;
    #material;

    /**
     * 
     * 构造函数
     * 
     * @param {*} material 
     */
    constructor(material) {
        this.#mesh          = new XThree.Mesh();
        this.#mesh.geometry = FullScreenRect.getInstance();
        this.#material      = material;
        this.#mesh.material = this.#material;
    }

    /**
     * 
     * 准备
     * 
     * @param {*} context 
     */
    prepare(context) {
        if (this.#material) {
            this.#material.prepare(context);
        }
    }

    /**
     * 获取材质
     */
    get material() {
        return this.#material;
    }

    /**
     * 
     * 执行渲染
     * 
     * @param {*} postprocess_buffers 
     * @param {*} renderer 
     * @param {*} camera 
     */
    render(postprocess_buffers, renderer, camera) {
        if (this.#mesh && this.#material) {
            renderer.setRenderTarget(postprocess_buffers.writeRenderTarget);
            if (isFunction(this.#material.setTexture)) {
                this.#material.setTexture(postprocess_buffers.readRenderTexture);
            }
            renderer.render(this.#mesh, camera);
        }
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.#mesh) {
            this.#mesh.dispose(false, true);
        }
    }
}
