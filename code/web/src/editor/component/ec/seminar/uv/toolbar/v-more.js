/* eslint-disable no-unused-vars */

import DropSelector from '@ux/controller/drop-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 取消全部缝合边
    {
        icon: 'editor/unselect-all.svg',
        token: 'unmark.all',
        text_token: "uv.unmark.all",
    },

    // 取消全部选择
    {
        icon: 'editor/unselect-all.svg',
        token: 'unselect.all',
        text_token: "uv.unselect.all",
    },

    // 分割线
    {
        separator: true
    },

    // 球面投影
    {
        icon: 'shape-3d/ball.svg',
        token: 'unfold.sphere',
        text_token: "uv.unfold.sphere",
    },

    // 柱面投影
    {
        icon: 'shape-3d/cylinder.svg',
        token: 'unfold.cylinder',
        text_token: "uv.unfold.cylinder",
    },

    // 三平面投影
    {
        icon: 'shape-3d/box.svg',
        token: 'unfold.triplanar',
        text_token: "uv.unfold.triplanar",
    },

    // 基于缝合边
    {
        icon: 'editor/stitched.svg',
        token: 'unfold.stitched.edges',
        text_token: "uv.unfold.stitched.edges",
    },

    // 分割线
    {
        separator: true
    },

    // 移除全部的UV数据
    {
        icon: 'ui/delete.svg',
        token: 'clear',
        text_token: "uv.clear",
    },
];

/**
 * 
 * @param {*} coordinator 
 * @param {*} host 
 * @param {*} reference_element 
 */
export default function ShowMore(coordinator, host, reference_element) {
    return DropSelector(
        _drop_selector_data_,
        (token) => {
            switch (token) {

            // 取消全部缝合边
            case 'unmark.all':
                host.unmarkAllStitchedEdges();
                break;

            // 取消全部选择
            case 'unselect.all':
                host.unselectAllEdges();
                break;

            // 球面投影
            case 'unfold.sphere':
                host.UV_UnfoldSphere();
                break;

            // 柱面投影
            case 'unfold.cylinder':
                host.UV_UnfoldCylinder();
                break;

            // 三平面投影
            case 'unfold.triplanar':
                host.UV_UnfoldTriplanar();
                break;

            // 基于缝合边
            case 'unfold.stitched.edges':
                host.UV_UnfoldStitchedEdges();
                break;

            // 移除全部的UV数据
            case 'clear':
                host.UV_Clear();
                break;

            }
        },
        document.body,
        reference_element,
        "bottom-start",
        "normal",
        0);
}