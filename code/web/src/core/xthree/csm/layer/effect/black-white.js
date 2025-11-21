/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * BlackWhite
 */
export default class BlackWhite extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "black-white";
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * FS
     * 
     * @returns 
     */
    fs() {
        const code = 
`
{
    float r = m3d_cur_color.r;
    float g = m3d_cur_color.g;
    float b = m3d_cur_color.b;
    float a = m3d_cur_color.a;
    float v = (r + g + b) / 3.0;
    if ((r + g + b) / 3.0 >= 100.0/256.0) {
        m3d_out = vec4(1, 1, 1, a);
    } else {
        m3d_out = vec4(0, 0, 0, a);
    }
}
`;
        return code;
    }
}
