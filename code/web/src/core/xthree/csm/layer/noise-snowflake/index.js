/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * NoiseSnowflake
 */
export default class NoiseSnowflake extends LayerBase {
    /**
     * 参数
     */
    random = new ShaderUniform.Int(0);

    /**
     * 获取类型
     */
    get type() {
        return "noise-snowflake";
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
        requirement.fs.hash = true;
    }

    /**
     * 
     * FS
     * 
     * @returns 
     */
    fs() {
        const random = this.random.name;
        const code = 
`
m3d_out = vec4(hash(uvec3(gl_FragCoord.xy, ${random})), 1.0);
`;
        return code;
    }
}
