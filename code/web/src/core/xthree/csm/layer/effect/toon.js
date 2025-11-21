/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import EffectBase    from "../base-effect";

/**
 * Toon
 */
export default class Toon extends EffectBase {
    /**
     * 参数
     */
    levels = new ShaderUniform.Float(4);

    /**
     * 获取类型
     */
    get type() {
        return "toon";
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
        const levels = this.levels.name;
        const code = 
`
{
    m3d_out.a   = m3d_cur_color.a;
    m3d_out.rgb = floor(m3d_cur_color.rgb * ${levels}) / ${levels};
}
`;
        return code;
    }
}
