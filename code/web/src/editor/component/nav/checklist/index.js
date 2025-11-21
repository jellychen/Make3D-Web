
import IsSupport_Boolean   from './boolean';
import IsSupport_Editor    from './editor';
import IsSupport_Merge     from './merge';
import IsSupport_Modifier  from './modifier';
import IsSupport_Scene     from './scene';
import IsSupport_Sculptor  from './sculptor';
import IsSupport_Simulator from './simulator';
import IsSupport_Tube      from './tube';
import IsSupport_UV        from './uv';

/**
 * 
 * 检测是否支持
 * 
 * @param {*} coordinator 
 * @param {*} token 
 */
function Check(coordinator, token) {
    if (!coordinator) {
        return false;
    }
    
    switch(token) {
    case 'boolean':
        return IsSupport_Boolean  (coordinator);
    case 'editor':
        return IsSupport_Editor   (coordinator);
    case 'merge':
        return IsSupport_Merge    (coordinator);
    case 'modifier':
        return IsSupport_Modifier (coordinator);
    case 'scene':
        return IsSupport_Scene    (coordinator);
    case 'sculptor':
        return IsSupport_Simulator(coordinator);
    case 'tube':
        return IsSupport_Tube     (coordinator);
    case 'uv':
        return IsSupport_UV       (coordinator);
    }
    return false;
}

export default {
    IsSupport_Boolean   ,
    IsSupport_Editor    ,
    IsSupport_Merge     ,
    IsSupport_Modifier  ,
    IsSupport_Scene     ,
    IsSupport_Sculptor  ,
    IsSupport_Simulator ,
    IsSupport_Tube      ,
    IsSupport_UV        ,

    Check               ,
}
