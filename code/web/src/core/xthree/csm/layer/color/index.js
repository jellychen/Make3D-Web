/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * 颜色层
 */
export default class Color extends LayerBase {
    /**
     * 颜色
     */
    color = new ShaderUniform.Vec3(0, 0, 0);

    /**
     * 获取类型
     */
    get type() {
        return "color";
    }

    /**
     * 
     * FS
     * 
     * @returns 
     */
    fs() {
        const color = this.color.name;
        const code = 
`
m3d_out = vec4(${color}, 1.0);
`;
        return code;
    }
}
