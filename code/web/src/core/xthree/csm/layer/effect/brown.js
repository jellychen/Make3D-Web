/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * Brown
 */
export default class Brown extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "brown";
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
    float new_r = r * 0.393 + g * 0.769 + b * 0.189;
    float new_g = r * 0.349 + g * 0.686 + b * 0.168;
    float new_b = r * 0.272 + g * 0.534 + b * 0.131;
    m3d_out = vec4(new_r, new_g, new_b, a);
}
`;
        return code;
    }
}
