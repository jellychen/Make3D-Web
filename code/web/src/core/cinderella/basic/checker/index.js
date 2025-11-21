
import WebGL from 'three/addons/capabilities/WebGL';

/**
 * 用来检测Webgl的可用性
 */
export default {
    /**
     * 
     * 判断WEBGL是不是可用的
     * 
     * @returns Boolean
     */
    isWebGLAvailable() {
        return WebGL.isWebGLAvailable();
    },

    /**
     * 
     * 如果WEBGL不能用，获取错误的信息
     * 
     * @returns String
     */
    getWebGLErrorMessage() {
        return WebGL.getWebGLErrorMessage();
    }
}
