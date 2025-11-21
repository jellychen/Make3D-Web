
import * as THREE        from 'three';
import * as THREE_WebGPU from 'three/webgpu';
import * as TSL          from 'three/tsl';

export default new class {
    /**
     * 构造函数
     */
    constructor() {
        this.setDefaultWebGL();
    }
    
    /**
     * 使用Webgl
     */
    setDefaultWebGL() {
        Object.assign(this, THREE);
        this.TSL          = TSL;
        this.Renderer     = THREE.WebGLRenderer;
        this.RenderTarget = THREE.WebGLRenderTarget;
    }

    /**
     * 使用WebGPU
     */
    setDefaultWebGPU() {
        Object.assign(this, THREE_WebGPU);
        this.TSL          = TSL;
        this.Renderer     = THREE_WebGPU.WebGPURenderer;
        this.RenderTarget = THREE_WebGPU.RenderTarget;
    }
}
