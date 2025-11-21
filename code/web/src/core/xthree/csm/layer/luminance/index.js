/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * 亮度
 */
export default class Luminance extends LayerBase {
    /**
     * 参数
     */
    color     = new ShaderUniform.Vec3 (1, 1, 1);
    intensity = new ShaderUniform.Float(1.0);
    factor    = new ShaderUniform.Float(1.0);

    /**
     * 获取类型
     */
    get type() {
        return "luminance";
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
        const color     = this.color .name;
        const intensity = this.intensity.name;
        const factor    = this.factor.name;

        const code = 
`
{
    float l = clamp(luminance(m3d_cur_color.rgb), 0.0, 1.0);
    m3d_out = vec4(${color} * ${intensity}, pow(l, ${factor}));
}
`;
        return code;
    }
}
