/* eslint-disable no-unused-vars */

import ShaderUniform from "../../shader-uniform";
import LayerBase     from "../base";

/**
 * 纹理
 */
export default class Texture extends LayerBase {
    /**
     * 参数
     */
    color   = new ShaderUniform.Vec3(1, 1, 1);
    texture = new ShaderUniform.Texture();

    /**
     * 获取类型
     */
    get type() {
        return "matcap";
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
        const color   = this.color  .name;
        const texture = this.texture.name;
    
        const code = 
`
{
    m3d_out = texture2D(${texture}, vMapUv);
    m3d_out.rgb *= ${color};
}
`;
    }
}
