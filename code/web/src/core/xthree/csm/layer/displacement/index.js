/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * Displacement
 */
export default class Displacement extends LayerBase {
    /**
     * 参数
     */
    seed               = new ShaderUniform.Float(0);
    bias               = new ShaderUniform.Vec3 (0, 0, 0);
    scale_noise        = new ShaderUniform.Vec3 (1, 1, 1);
    scale_displacement = new ShaderUniform.Vec3 (1, 1, 1);

    /**
     * 获取类型
     */
    get type() {
        return "displacement";
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
        requirement.vs.perlin_noise = true;
    }

    /**
     * 
     * VS
     * 
     * @returns 
     */
    vs() {
        const seed               = this.seed              .name;
        const bias               = this.bias              .name;
        const scale_noise        = this.scale_noise       .name;
        const scale_displacement = this.scale_displacement.name;

        const code = 
`
{
    float n = PerlinNoise(m3c_position * ${scale_noise} + vec3(0, ${seed}, 0));
    m3c_displacement_bias += ${bias};
    m3c_displacement_offset += n * ${scale_displacement};
}
`;
        return code;
    }
}
