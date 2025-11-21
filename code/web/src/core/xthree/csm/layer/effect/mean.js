/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * 均值
 */
export default class Mean extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "mean";
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
    m3d_out = vec4(v, v, v, a);
}
`;
        return code;
    }
}