/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * 颜色翻转
 */
export default class Reverse extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "reverse";
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
    m3d_out = vec4(1.0 - r, 1.0 - g, 1.0 - b, a);
}
`;
        return code;
    }
}