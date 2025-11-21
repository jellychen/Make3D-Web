/* eslint-disable no-unused-vars */

import isFunction   from 'lodash/isFunction';
import DropSelector from '@ux/controller/drop-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 平面
    {
        icon         : 'shape-3d/plane.svg',
        token        : 'plane',
        text_token   : "shape.plane",
    },

    // 平面网格
    {
        icon         : 'shape-3d/plane-grid.svg',
        token        : 'plane.grid',
        text_token   : "shape.plane.grid",
    },

    // 分割线
    {
        separator    : true
    },

    // 多边形
    {
        icon         : 'shape/pentagon.svg',
        token        : 'polygon',
        text_token   : "shape.polygon",
    },

    // 分割线
    {
        separator    : true
    },

    // 立方体
    {
        icon         : 'shape-3d/cube.svg',
        token        : 'cube',
        text_token   : "shape.cube",
    },

    // 球体
    {
        icon         : 'shape-3d/sphere.svg',
        token        : 'sphere',
        text_token   : "shape.sphere",
    },

    // 圆柱体
    {
        icon         : 'shape-3d/cylinder.svg',
        token        : 'cylinder',
        text_token   : "shape.cylinder",
    },

    // 圆锥
    {
        icon         : 'shape-3d/cone.svg',
        token        : 'cone',
        text_token   : "shape.cone",
    },

    // 四棱锥
    {
        icon         : 'shape-3d/pyramid.svg',
        token        : 'pyramid',
        text_token   : "shape.pyramid",
    },

    // 正二十面体
    // {
    //     icon      : 'shape-3d/icosahedron.svg',
    //     token     : 'icosahedron',
    //     text_token: "shape.icosahedron",
    // },

    // 正十二面体
    // {
    //     icon      : 'shape-3d/dodecahedron.svg',
    //     token     : 'dodecahedron',
    //     text_token: "shape.dodecahedron",
    // },

    // 圆环
    {
        icon         : 'shape-3d/torus.svg',
        token        : 'torus',
        text_token   : "shape.torus",
    },

    // 螺旋
    {
        icon         : 'shape-3d/helix.svg',
        token        : 'helix',
        text_token   : "shape.helix",
    },

    // 分割线
    {
        separator    : true
    },

    // 管道工具
    {
        icon         : 'ui/tube.svg',
        token        : 'tube',
        text_token   : "tube",
    },
    
    // 分割线
    {
        separator    : true
    },

    // susan
    {
        icon         : 'shape-3d/blender-susan.svg',
        token        : 'susan',
        text_token   : "shape.blender.susan",
    },

    // 分割线
    {
        separator    : true
    },

    // 点光源
    {
        icon         : 'light/point.svg',
        token        : 'light.point',
        text_token   : "light.point",
    },

    // 方向光
    {
        icon         : 'light/dir.svg',
        token        : 'light.dir',
        text_token   : "light.dir",
    },

    // 聚光灯
    {
        icon         : 'light/spot.svg',
        token        : 'light.spot',
        text_token   : "light.spot",
    },

    // 分割线
    {
        separator    : true
    },

    // 展示柜
    {
        icon         : 'ui/exhibition.svg',
        token        : 'cabinet',
        text_token   : "cabinet",
    },
];

/**
 * 打开选择
 * 
 * @param {*} parent_node 
 * @param {*} on_selected 
 */
export default function(parent_node, on_selected) {
    if (!isFunction(on_selected)) {
        on_selected = () => {};
    }

    DropSelector(
        _drop_selector_data_,
        on_selected,
        parent_node,
        parent_node,
        'bottom-start',
        'normal',
        5);
}
