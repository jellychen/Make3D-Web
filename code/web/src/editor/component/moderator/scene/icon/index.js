/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isFunction from 'lodash/isFunction';

/**
 * 
 * 设置
 * 
 * @param {*} icon 
 * @param {string} icon_type 
 */
export default function(icon, icon_type) {
    if (!isFunction(icon.setIcon)) {
        return;
    }

    switch (icon_type) {
    case 'Camera':
    case 'CubeCamera':
    case 'OrthographicCamera':
    case 'PerspectiveCamera':
    case 'StereoCamera':
        icon.setIcon('scene-tree-icon/camera.svg');
        break;

    case 'Scene':
        icon.setIcon('scene-tree-icon/scene.svg');
        break;
    
    //
    // 灯光
    //
    case 'SpotLight':
    case 'SpotLight-Holder':
    case 'light-spot':
    case 'light-spot-holder':
        icon.setIcon('scene-tree-icon/light-spot.svg');
        break;

    case 'DirectionalLight':
    case 'DirectionalLight-Holder':
    case 'light-dir':
    case 'light-dir-holder':
        icon.setIcon('scene-tree-icon/light-dir.svg');
        break;

    case 'PointLight':
    case 'PointLight-Holder': 
    case 'light-point':
    case 'light-point-holder':
        icon.setIcon('scene-tree-icon/light-point.svg');
        break;
    
    //
    // 元素
    //
    case 'group':
    case 'Group':
        icon.setIcon('scene-tree-icon/group.svg');
        break;

    case 'Mesh':
        icon.setIcon('scene-tree-icon/mesh.svg');
        break;

    case 'Points':
        icon.setIcon('scene-tree-icon/point.svg');
        break;

    case 'LineSegments':
        icon.setIcon('scene-tree-icon/line.svg');
        break;
    
    default:
        icon.setIcon('scene-tree-icon/cube.svg');
        break;
    }
}
