/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * Gradient
 */
export default class Gradient extends LayerBase {
    /**
     * 参数
     */
    anchor      = new ShaderUniform.Vec3 (0, 0, 0);
    color_start = new ShaderUniform.Vec3 (0, 0, 0);
    color_end   = new ShaderUniform.Vec3 (0, 0, 0);
    near        = new ShaderUniform.Float(0);
    far         = new ShaderUniform.Float(100);
    factor      = new ShaderUniform.Float(1);

    /**
     * 获取类型
     */
    get type() {
        return "gradient";
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
        const anchor      = this.anchor     .name;
        const color_start = this.color_start.name;
        const color_end   = this.color_end  .name;
        const near        = this.near       .name;
        const far         = this.far        .name;
        const factor      = this.factor     .name;

        const code = 
`
{
    float dist = distance(${anchor}, m3c_internal_local_position) - ${near};
    float a = pow(clamp(dist / (${far} - ${near}), 0.0, 1.0), ${factor});
    float alpha = smoothstep(0.0, 1.0, a);
    m3d_out = vec4(mix(${color_start}, ${color_end}, a), alpha);
}
`;
        return code;
    }
}
