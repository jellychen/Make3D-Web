/* eslint-disable no-unused-vars */

import EffectBase from "../base-effect";

/**
 * Grey
 */
export default class Grey extends EffectBase {
    /**
     * 获取类型
     */
    get type() {
        return "grey";
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
    const highp vec3 w = vec3(0.2125, 0.7154, 0.0721);
    m3d_out.a   = m3d_cur_color.a;
    m3d_out.rgb = vec3(dot(m3d_cur_color.rbg, w));
}
`;
        return code;
    }
}
