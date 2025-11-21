/* eslint-disable no-unused-vars */

import Translate from "./translate/v";
import Scale     from "./scale/v";
import Rotate    from "./rotate/v";
import Keyframe  from './keyframe/v';

/**
 * 
 * 构建动画参数编辑
 * 
 * @param {*} type 
 * @param {*} coordinator 
 * @param {*} user_data 
 * @returns 
 */
export default function(type, coordinator, user_data) {
    switch(type) {
    case 'translate':
    case 't': {
        const v = new Translate(coordinator);
        return v;
    }

    case 'scale':
    case 's': {
        const v = new Scale(coordinator);
        return v;
    }

    case 'rotate':
    case 'r': {
        const v = new Rotate(coordinator);
        return v;
    }
    case 'keyframe':
    case 'k': {
        const v = new Keyframe(coordinator);
        return v;
    }
    }
}
