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
        const texture         = tsl.texture(new XThree.Texture());
        const near            = tsl.uniform(tsl.float(0.1));
        const far             = tsl.uniform(tsl.float(1000));
        this.#uniform.texture = texture;
        this.#uniform.near    = texture;
        this.#uniform.far     = far;
        this.positionNode     = tsl.positionGeometry;
    }
}