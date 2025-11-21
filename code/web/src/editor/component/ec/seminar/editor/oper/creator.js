/* eslint-disable no-unused-vars */

import Basic           from './basic';
import Circumcidere    from './circumcidere';
import EdgeSlide       from './edge-slide';
import EdgeContinuous  from './edge-continuous';
import Linkup          from './linkup';
import Bevel           from './bevel';
import Subdivison      from './subdivison';
import Inset           from './inset';
import Extrude         from './extrude';
import ExtrudeVertex   from './extrude-vertex';
import FaceCenterSplit from './face-center-split';

/**
 * 
 * 工厂函数
 * 
 * @param {String} type 
 * @param {*} coordinator 
 * @param {*} arena 
 * @param {*} connector 
 * @param {*} host 
 * @returns 
 */
export default function Creator(type, coordinator, arena, connector, host) {
    // 找到对应的类
    let SMC = undefined;
    switch (type) {
    case 'none':                            // 基础编辑器
    case 'basic':                           // 基础编辑器
        SMC = Basic;
        break;

    case 'circumcidere':                    // 环切
        SMC = Circumcidere;
        break;

    case 'linkup':                          // 衔接
        SMC = Linkup;
        break;

    case 'edge-continuous':                 // 边连续
        SMC = EdgeContinuous;
        break;

    case 'edge-slide':                      // 边滑移
        SMC = EdgeSlide;
        break;

    case 'bevel':                           // 倒角/倒圆
        SMC = Bevel;
        break;

    case 'subdivision':                     // 细分
        SMC = Subdivison;
        break;

    case 'extrude.vertex':                  // 点面挤出
        SMC = ExtrudeVertex;
        break;

    case 'extrude':                         // 面挤出
        SMC = Extrude;
        break;

    case 'inset':                           // 面挤出
        SMC = Inset;
        break;

    case 'face.center.split':               // 面中心分拆
        SMC = FaceCenterSplit;
        break;

    default:
        SMC = Basic;
        break;
    }
        
    return new SMC(coordinator, arena, connector, host);
}
