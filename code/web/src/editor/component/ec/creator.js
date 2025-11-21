/* eslint-disable no-unused-vars */

import EcV          from "./cell";
import EcScene      from "./seminar/scene";
import EcMerge      from './seminar/merge';
import EcModifier   from "./seminar/modifier";
import EcEditor     from "./seminar/editor";
import EcSculptor   from "./seminar/sculptor";
import EcBoolean    from './seminar/boolean';
import EcUV         from './seminar/uv';
import EcSimulator  from './seminar/simulator';
import EcTube       from "./seminar/tube";

/**
 * 
 * 工厂
 * 
 * @param {string} type 
 * @param {*} coordinator 
 * @returns 
 */
export default function Creator(type, coordinator) {
    let ECS = EcScene;

    switch (type) {
    case 'scene':
        ECS = EcScene;
        break;

    case 'merge':
        ECS = EcMerge;
        break;

    case 'modifier':
        ECS = EcModifier;
        break;

    case 'editor':
        ECS = EcEditor;
        break;

    case 'boolean':
        ECS = EcBoolean;
        break;

    case 'uv':
        ECS = EcUV;
        break;

    case 'sculptor':
        ECS = EcSculptor;
        break;

    case 'simulator':
        ECS = EcSimulator;
        break;

    case 'tube':
        ECS = EcTube;
        break;
    }
    
    return new ECS(coordinator);
}
