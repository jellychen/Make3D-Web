/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl    from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.colorNode  = tsl.vec4(1, 0, 0, 1);
        this.side       = XThree.DoubleSide;
        this.depthTest  = false;
        this.depthWrite = false;
    }
}
