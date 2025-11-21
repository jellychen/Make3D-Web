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
        const texture           = tsl.texture(new XThree.Texture());
        const color             = tsl.uniform(tsl.color(0xFFFFFF));
        this.#uniform.texture   = texture;
        this.#uniform.color     = color;
        this.vertexNode         = tsl.vec4(tsl.positionGeometry);
        this.colorNode          = tsl.Fn(() => {
            const uv            = tsl.uv().toVar();
            const texture_size  = tsl.textureSize(texture).toVec2().toVar();
            const w             = tsl.float(1.0).div(texture_size.x).toVar();
            const h             = tsl.float(1.0).div(texture_size.y).toVar();
            const texel         = tsl.vec2(w, h);

            // Adjust the inversion of the UV coordinates
            uv.y.assign(tsl.oneMinus(uv.y));

            // kernel definition (in glsl matrices are filled in column-major order)
			const Gx = tsl.mat3( - 1, - 2, - 1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const Gy = tsl.mat3( - 1, 0, 1, - 2, 0, 2, - 1, 0, 1 ); // y direction kernel
            
            // sample texture
            const sampleTexture = (uv) => texture.sample(uv);

            // fetch the 3x3 neighbourhood of a fragment
            // first column
			const tx0y0 = sampleTexture(uv.add(texel.mul(tsl.vec2( - 1, - 1)))).r;
			const tx0y1 = sampleTexture(uv.add(texel.mul(tsl.vec2( - 1,   0)))).r;
			const tx0y2 = sampleTexture(uv.add(texel.mul(tsl.vec2( - 1,   1)))).r;

            // second column
			const tx1y0 = sampleTexture(uv.add(texel.mul(tsl.vec2( 0,   - 1)))).r;
			const tx1y1 = sampleTexture(uv.add(texel.mul(tsl.vec2( 0,     0)))).r;
			const tx1y2 = sampleTexture(uv.add(texel.mul(tsl.vec2( 0,     1)))).r;

            // third column
			const tx2y0 = sampleTexture(uv.add(texel.mul(tsl.vec2( 1,   - 1)))).r;
			const tx2y1 = sampleTexture(uv.add(texel.mul(tsl.vec2( 1,     0)))).r;
			const tx2y2 = sampleTexture(uv.add(texel.mul(tsl.vec2( 1,     1)))).r;

            // gradient value in x direction
			const valueGx = tsl.add(
				Gx[ 0 ][ 0 ].mul( tx0y0 ),
				Gx[ 1 ][ 0 ].mul( tx1y0 ),
				Gx[ 2 ][ 0 ].mul( tx2y0 ),
				Gx[ 0 ][ 1 ].mul( tx0y1 ),
				Gx[ 1 ][ 1 ].mul( tx1y1 ),
				Gx[ 2 ][ 1 ].mul( tx2y1 ),
				Gx[ 0 ][ 2 ].mul( tx0y2 ),
				Gx[ 1 ][ 2 ].mul( tx1y2 ),
				Gx[ 2 ][ 2 ].mul( tx2y2 )
			);

            // gradient value in y direction
			const valueGy = tsl.add(
				Gy[ 0 ][ 0 ].mul( tx0y0 ),
				Gy[ 1 ][ 0 ].mul( tx1y0 ),
				Gy[ 2 ][ 0 ].mul( tx2y0 ),
				Gy[ 0 ][ 1 ].mul( tx0y1 ),
				Gy[ 1 ][ 1 ].mul( tx1y1 ),
				Gy[ 2 ][ 1 ].mul( tx2y1 ),
				Gy[ 0 ][ 2 ].mul( tx0y2 ),
				Gy[ 1 ][ 2 ].mul( tx1y2 ),
				Gy[ 2 ][ 2 ].mul( tx2y2 )
			);

            // magnitude of the total gradient
            const G = valueGx.mul(valueGx).add(valueGy.mul(valueGy)).sqrt().toVar();
            G.assign(tsl.clamp(G, tsl.float(0), tsl.float(1)));
            const out = tsl.vec4(this.#uniform.color.mul(G), G);
            return tsl.convertColorSpace(out, XThree.LinearSRGBColorSpace, XThree.SRGBColorSpace);
        })();
        this.transparent = true;
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
     * 设置掩码图
     * 
     * @param {*} texture 
     */
    setMask(texture) {
        this.setTexture(texture);
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#uniform.color.value.setHex(color);
    }
}
