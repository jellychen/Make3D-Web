/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * ComicStrip
 */
export default class ComicStrip extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "comic-strip";
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
    float new_r = abs(g - b + g + r) * r;
    float new_g = abs(b - g + b + r) * r;
    float new_b = abs(b - g + b + r) * g;
    m3d_out = vec4(new_r, new_g, new_b, a);
}
`;
        return code;
    }
}
