/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import * as XThree from 'three/webgpu';
import * as tsl from 'three/tsl';

/**
 * 材质
 */
export default class Material extends XThree.NodeMaterial {
    /**
     * 编号
     */
    #sid_current = 0;

    /**
     * unifrom
     */
    #u_id;

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.#u_id                = tsl.uniform(tsl.float(1.0));
        const pack                = tsl.Fn(([v_immutable, min_immutable, max_immutable]) => {
            const max             = tsl.float(max_immutable).toVar();
            const min             = tsl.float(min_immutable).toVar();
            const v               = tsl.float(v_immutable).toVar();
            const zeroToOne       = tsl.float(v.sub(min).div(max.sub(min))).toVar();
            const zeroTo24Bit     = tsl.float(zeroToOne.mul(256.0).mul(256.0).mul(255.0)).toVar();
            return tsl.vec3(tsl.mod(zeroTo24Bit, 256.0), tsl.mod(zeroTo24Bit.div(256.0), 256.0), zeroTo24Bit.div(256.0).div(256.0));

        }).setLayout({
            name                  : 'pack',
            type                  : 'vec3',
            inputs                : [
                { name            : 'v'  , type: 'float' },
                { name            : 'min', type: 'float' },
                { name            : 'max', type: 'float' }
            ]
        });

        this.colorNode            = tsl.Fn(() => {
            const uid             = this.#u_id.toVar();
            const dir             = tsl.normalize(tsl.negate(tsl.positionView)).toVar();
            const fdx             = tsl.dFdx(dir).toVar();
            const fdy             = tsl.dFdy(dir).toVar();
            const normal          = tsl.normalize(tsl.cross(fdx, fdy)).toVar();
            const alpha           = tsl.abs(tsl.dot(dir, normal));
            return tsl.vec4(pack(uid, 0.0, 102400), alpha);
        })();

        this.onObjectBeforeRender = () => {
            this.#sid_current     += 1;
            this.#sid_current     = this.#sid_current % 2048;
            this.#u_id.value      = this.#sid_current;
        };
    }

    /**
     * 
     * 重置ID
     * 
     * @returns 
     */
    resetSid() {
        this.#sid_current = 0;
        return this;
    }
}
