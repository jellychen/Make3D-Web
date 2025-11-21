/* eslint-disable no-unused-vars */

import LayerCluster from "./layer/layer-cluster";

/**
 * 层材质
 */
export default class CSM extends LayerCluster {
    /**
     * 表示这是一个自定义的材质
     */
    get isCSM() {
        return true;
    }
};

