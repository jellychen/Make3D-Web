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
        const opacity         = tsl.uniform(tsl.float(0.9));
        this.#uniform.texture = texture;
        this.#uniform.opacity = opacity;
        this.colorNode        = tsl.Fn(() => {
            const out         = texture.sample(tsl.uv()).mul(opacity).toVar();
            return tsl.convertColorSpace(out, XThree.LinearSRGBColorSpace, XThree.SRGBColorSpace);
        })();

        this.visible          = true;
        this.depthTest        = true;
        this.depthWrite       = false;
        this.transparent      = true;
        this.blending         = XThree.CustomBlending;
        this.blendEquation    = XThree.AddEquation;
        this.blendSrc         = XThree.SrcAlphaFactor;
        this.blendDst         = XThree.OneMinusSrcAlphaFactor;
        this.side             = XThree.DoubleSide;
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

    /**
     * 
     * 设置不透明度
     * 
     * @param {*} opacity 
     */
    setOpacity(opacity) {
        this.#uniform.opacity.value = opacity;
    }
}