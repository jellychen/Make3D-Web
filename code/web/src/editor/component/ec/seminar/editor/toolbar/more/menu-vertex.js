/* eslint-disable no-unused-vars */

import DropSelector from '@ux/controller/drop-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 全选
    {
        icon: 'editor/select-all.svg',
        token: 'select-all',
        text_token: "editor.select_all",
    },

    // 全不选
    {
        icon: 'editor/unselect-all.svg',
        token: 'unselect-all',
        text_token: "editor.unselect_all",
    },

    // 分割线
    {
        separator: true
    },

    // 衔接
    {
        icon: 'editor/link.svg',
        token: 'linkup',
        text_token: "editor.linkup",
    },

    // 平滑
    {
        icon: 'editor/smooth.svg',
        token: 'smooth',
        text_token: "editor.laplace_smooth",
    },

    // 分割线
    {
        separator: true
    },

    // 删除
    {
        icon: 'editor/delete.svg',
        token: 'delete',
        text_token: "editor.delete",
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
            let topo_controller_misc = host.topoController.getManipulatorMisc();
            let need_update = false;
            switch (token) {
            case 'select-all':
                need_update = host.topoController.selectAllVertices();
                break;
    
            case 'unselect-all':
                need_update = host.topoController.unselectAllVertices();
                break;

            case 'linkup':
                need_update = topo_controller_misc.v().linkUp();
                break;

            case 'smooth':
                need_update = topo_controller_misc.v().laplaceSmooth();
                break;

            case 'delete':
                need_update = topo_controller_misc.v().delete_();
                break;
            }

            if (need_update) {
                host.arena.markNeedUpdate();
                host.renderNextFrame();
            }
        },
        document.body,
        reference_element,
        "bottom-start",
        "normal",
        0);
}
