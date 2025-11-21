/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import EffectBase    from "../base-effect";

/**
 * Exposure
 */
export default class Exposure extends EffectBase {
    /**
     * 参数
     */
    exposure = new ShaderUniform.Float(1.0);

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
        const exposure = this.exposure.name;
        const code = 
`
{
    m3d_out.a   = m3d_cur_color.a;
    m3d_out.rgb = m3d_cur_color.rgb * ${exposure};
}
`;
        return code;
    }
}
