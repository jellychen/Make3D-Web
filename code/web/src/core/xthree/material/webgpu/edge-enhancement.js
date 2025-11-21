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
        const texture = tsl.texture(new XThree.Texture());
        const color = tsl.uniform(tsl.color(0x0));
        this.#uniform.texture = texture;
        this.#uniform.color = color;
        this.vertexNode = tsl.vec4(tsl.positionGeometry);

        const unpack          = tsl.Fn(([v_immutable, min_immutable, max_immutable]) => {
            const max         = tsl.float(max_immutable).toVar();
            const min         = tsl.float(min_immutable).toVar();
            const v           = tsl.vec3(v_immutable).toVar();
            const zeroTo24Bit = tsl.float(v.x.add(v.y.mul(256.0)).add(v.z.mul(256.0).mul(256.0))).toVar();
            const zeroToOne   = tsl.float(zeroTo24Bit.div(256.0).div(256.0).div(256.0)).toVar();
            return zeroToOne.mul(max.sub(min)).add(min);
        }).setLayout({
            name              : 'unpack',
            type              : 'float',
            inputs            : [
                { name        : 'v', type: 'vec3' },
                { name        : 'min', type: 'float' },
                { name        : 'max', type: 'float' }
            ]
        });

        this.colorNode = tsl.Fn(() => {
            const uv           = tsl.uv().toVar();
            const texture_size = tsl.textureSize(texture).toVar();
            const w            = tsl.float(1.0).div(texture_size.x).toVar();
            const h            = tsl.float(1.0).div(texture_size.y).toVar();
            const texel        = tsl.vec2(w, h);

            // Adjust the inversion of the UV coordinates
            uv.y.assign(tsl.oneMinus(uv.y));

            // kernel definition (in glsl matrices are filled in column-major order)
			const Gx = tsl.mat3( - 1, - 2, - 1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const Gy = tsl.mat3( - 1, 0, 1, - 2, 0, 2, - 1, 0, 1 ); // y direction kernel

            // sample texture
            const sampleTexture = (uv   ) => texture.sample(uv);
            const colorUnpack   = (color) => unpack(color, 0, 10240);

            // fetch the 3x3 neighbourhood of a fragment
            // first column
            const clr_0 = sampleTexture(uv.add(texel.mul(tsl.vec2(- 1, - 1)))).toVar();
            const clr_1 = sampleTexture(uv.add(texel.mul(tsl.vec2(- 1, 0)))).toVar();
            const clr_2 = sampleTexture(uv.add(texel.mul(tsl.vec2(- 1, 1)))).toVar();
            const tx0y0 = colorUnpack(clr_0.rgb);
            const tx0y1 = colorUnpack(clr_1.rgb);
            const tx0y2 = colorUnpack(clr_2.rgb);

            // second column
            const clr_3 = sampleTexture(uv.add(texel.mul(tsl.vec2(0, - 1)))).toVar();
            const clr_4 = sampleTexture(uv.add(texel.mul(tsl.vec2(0, 0)))).toVar();
            const clr_5 = sampleTexture(uv.add(texel.mul(tsl.vec2(0, 1)))).toVar();
            const tx1y0 = colorUnpack(clr_3.rgb);
            const tx1y1 = colorUnpack(clr_4.rgb);
            const tx1y2 = colorUnpack(clr_5.rgb);

            // third column
            const clr_6 = sampleTexture(uv.add(texel.mul(tsl.vec2(1, - 1)))).toVar();
            const clr_7 = sampleTexture(uv.add(texel.mul(tsl.vec2(1, 0)))).toVar();
            const clr_8 = sampleTexture(uv.add(texel.mul(tsl.vec2(1, 1)))).toVar();
            const tx2y0 = colorUnpack(clr_6.rgb);
            const tx2y1 = colorUnpack(clr_7.rgb);
            const tx2y2 = colorUnpack(clr_8.rgb);

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

            // alpha
            const min_alpha = tsl.float(1.0).toVar();
            min_alpha.assign(tsl.min(min_alpha, clr_0.a));
            min_alpha.assign(tsl.min(min_alpha, clr_1.a));
            min_alpha.assign(tsl.min(min_alpha, clr_2.a));
            min_alpha.assign(tsl.min(min_alpha, clr_3.a));
            min_alpha.assign(tsl.min(min_alpha, clr_4.a));
            min_alpha.assign(tsl.min(min_alpha, clr_5.a));
            min_alpha.assign(tsl.min(min_alpha, clr_6.a));
            min_alpha.assign(tsl.min(min_alpha, clr_7.a));
            min_alpha.assign(tsl.min(min_alpha, clr_8.a));
            tsl.If(tsl.lessThan(min_alpha, tsl.float(0.05)), () => {
                G.assign(0);
            }).Else(() => {
                G.assign(G.mul(0.8));
            });

            const out = tsl.vec4(this.#uniform.color, G);
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
     * 设置纹理
     * 
     * @param {*} texture 
     */
    setMask(texture) {
        this.#uniform.texture.value = texture;
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
