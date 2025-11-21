/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * Brown
 */
export default class Freeze extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "freeze";
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
    float new_r = clamp((r - g - b) * 3.0 / 2.0, 0.0, 1.0);
    float new_g = clamp((g - r - b) * 3.0 / 2.0, 0.0, 1.0);
    float new_b = clamp((b - g - r) * 3.0 / 2.0, 0.0, 1.0);
    m3d_out = vec4(new_r, new_g, new_b, a);
}
`;
        return code;
    }
}
