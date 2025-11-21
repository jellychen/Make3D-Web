
import XThree from '@xthree/basic';
import Dir    from './dir';
import Point  from './point';
import Spot   from './spot';

/**

 * WebGPU 需要注册进去
 */
export default {
    /**
     * 
     * 注册
     * 
     * @param {*} renderer 
     */
    Add(renderer) {
        if (renderer && renderer.library && renderer.library.addLight) {
            const lib = renderer.library;
            lib.addLight(XThree.DirectionalLightNode, Dir);
            lib.addLight(XThree.PointLightNode,       Point);
            lib.addLight(XThree.SpotLightNode,        Spot);
        }
    }
}