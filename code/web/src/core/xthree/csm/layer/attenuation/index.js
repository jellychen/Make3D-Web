/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * 衰减
 */
export default class Attenuation extends LayerBase {
    /**
     * 参数
     */
    color        = new ShaderUniform.Vec3 (1, 1, 1);
    anchor       = new ShaderUniform.Vec3 (0, 0, 0);
    max_distance = new ShaderUniform.Float(100);
    factor       = new ShaderUniform.Float(1);

    /**
     * 获取类型
     */
    get type() {
        return "attenuation";
    }

    /**
     * 
     * FS
     * 
     * @returns 
     */
    fs() {
        const color        = this.color .name;
        const anchor       = this.anchor.name;
        const max_distance = this.max_distance.name;
        const factor       = this.factor.name;
        const code         = 
`
{
    float dist = distance(${anchor}, m3c_internal_local_position);
    float a = pow(clamp(1.0 - dist / ${max_distance}, 0.0, 1.0), ${factor});
    m3d_out = vec4(${color}, a);
}
`;
        return code;
    }
}