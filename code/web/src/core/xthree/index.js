
import Basic      from "./basic";
import Renderable from './renderable';
import Material   from './material';

/**
 * 允许外部设置
 */
export default {
    /**
     * 
     * 设置默认的图形接口
     * 
     * @param {string} xapi 
     */
    setDefault(xapi) {
        switch (xapi.toLocaleLowerCase()) {
        case 'webgl' : 
            Basic     .setDefaultWebGL();
            Renderable.setDefaultWebGL();
            Material  .setDefaultWebGL();
            break;

        case 'webgpu': 
            Basic     .setDefaultWebGPU();
            Renderable.setDefaultWebGPU();
            Material  .setDefaultWebGPU();
            break;
        }
    }
}
