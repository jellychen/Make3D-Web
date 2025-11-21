/* eslint-disable no-unused-vars */

import LayerBase from "../base";

/**
 * PBR 层
 */
export default class Pbr extends LayerBase {
    /**
     * 获取类型
     */
    get type() {
        return "pbr";
    }

    /**
     * 
     * FS
     * 
     * @returns 
     */
    fs() {
        const code = 
`
m3d_out = m3d_pbr_color;
`;
        return code;
    }
}
