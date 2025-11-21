/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * uniform
     */
    #uniform = {};

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.#uniform.texture = tsl.texture(new XThree.Texture());
        this.colorNode        = this.#uniform.texture.sample(tsl.uv());
    }

    /**
     * 
     * 设置纹理
     * 
     * @param {*} texture 
     */
    setTexture(texture) {
        this.#uniform.texture.value = texture;
    }
}
