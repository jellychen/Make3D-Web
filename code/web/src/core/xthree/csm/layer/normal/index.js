/* eslint-disable no-unused-vars */

import LayerBase from "../base";

/**
 * 法线层
 */
export default class Normal extends LayerBase {
    /**
     * 获取类型
     */
    get type() {
        return "normal";
    }

    /**
     * 
     * 返回
     * 
     * @returns 
     */
    fs() {
        const code = 
`
m3d_out = vec4(m3c_internal_normal, 1);
`;
        return code;
    }
}