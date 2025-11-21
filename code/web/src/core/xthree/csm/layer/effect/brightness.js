/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import EffectBase    from "../base-effect";

/**
 * brightness-contrast
 */
export default class Brightness extends EffectBase {
    /**
     * 参数
     */
    brightness = new ShaderUniform.Float(0.0);
    contrast   = new ShaderUniform.Float(0.0);

    /**
     * 获取类型
     */
    get type() {
        return "brightness";
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
        const brightness = this.brightness.name;
        const contrast   = this.contrast  .name;

        const code = 
`
{
    m3d_out.a   = m3d_cur_color.a;
    m3d_out.rgb = m3d_cur_color.rgb + ${brightness};
    if (${contrast} > 0.0) {
        m3d_out.rgb = (m3d_out.rgb - 0.5) / (1.0 - contrast) + 0.5;
    } else {
        m3d_out.rgb = (m3d_out.rgb - 0.5) * (1.0 + contrast) + 0.5;
    }
}
`;
        return code;
    }
}
