/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * Noise
 */
export default class Noise extends LayerBase {
    /**
     * 参数
     */
    color     = new ShaderUniform.Vec3 (0, 0, 0);
    intensity = new ShaderUniform.Float(1.0);
    scale     = new ShaderUniform.Float(10.0);
    factor    = new ShaderUniform.Float(1.0);

    /**
     * 获取类型
     */
    get type() {
        return "noise";
    }

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 
     * 准备
     * 
     * @param {*} requirement 
     */
    prepare(requirement) {
        requirement.fs.simplex_noise = true;
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
        const scale     = this.scale.name;
        const factor    = this.factor.name;

        const code = 
`
{
    vec3 position = m3c_internal_local_position * ${scale};
    float noise = pow(clamp(snoise(position), 0.0, 1.0), ${factor});
    m3d_out = vec4(${color} * ${intensity}, noise);
}
`;
        return code;
    }
}
