/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * Fresnel
 */
export default class Fresnel extends LayerBase {
    /**
     * 参数
     */
    color     = new ShaderUniform.Vec3 (1, 1, 1);
    intensity = new ShaderUniform.Float(2.0);
    factor    = new ShaderUniform.Float(5.0);

    /**
     * 获取类型
     */
    get type() {
        return "fresnel";
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
        requirement.fs.fresnel = true;
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
    float theta   = clamp(dot(normalize(m3c_internal_view_normal), normalize(m3c_internal_view_dir)), 0.0, 1.0);
    float fresnel = Fresnel(theta, ${factor});
    m3d_out = vec4(${color} * ${intensity}, fresnel);
}
`;
        return code;
    }
}
