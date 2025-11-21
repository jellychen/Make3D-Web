/* eslint-disable no-unused-vars */

import DropSelector from '@ux/controller/drop-selector';

/**
 * 下拉菜单的数据
 */
const _drop_selector_data_ = [
    // 全选
    {
        icon      : 'editor/select-all.svg',
        token     : 'select-all',
        text_token: "editor.select_all",
    },

    // 全不选
    {
        icon      : 'editor/unselect-all.svg',
        token     : 'unselect-all',
        text_token: "editor.unselect_all",
    },

    // 分割线
    {
        separator : true
    },

    // 中心分拆
    {
        icon      : 'editor/split.svg',
        token     : 'center_split',
        text_token: "editor.center_split",
    },

    // 衔接成面
    {
        icon      : 'editor/link.svg',
        token     : 'link_up_as_face',
        text_token: "editor.link_up_as_face",
    },

    // 拼合
    {
        icon      : 'editor/blocks.svg',
        token     : 'piece_together',
        text_token: "editor.piece_together",
    },

    // 拼合 循环
    {
        token     : 'piece_together_loop',
        text_token: "editor.piece_together_loop",
    },

    // 消融
    {
        icon      : 'editor/edge-dissolve.svg',
        token     : 'dissolve',
        text_token: "editor.dissolve",
    },

    // 补洞
    {
        icon      : 'editor/brush.svg',
        token     : 'hole_fill',
        text_token: "editor.hole_fill",
    },

    // 补洞 - 高级
    {
        token     : 'hole_fill_advanced',
        text_token: "editor.hole_fill_advanced",
    },

    // 边分拆
    {
        icon      : 'editor/edges-partition.svg',
        token     : 'edges_partition',
        text_token: "editor.edges_partition",
    },

    // 分割线
    {
        separator : true
    },

    // 边连续
    {
        icon      : 'editor/continuous.svg',
        token     : 'edges_continuous-x',
        text_token: "editor.edges_continuous.x",
    },

    {
        token     : 'edges_continuous-y',
        text_token: "editor.edges_continuous.y",
    },

    {
        token     : 'edges_continuous-z',
        text_token: "editor.edges_continuous.z",
    },

    // 分割线
    {
        separator : true
    },

    // 删除
    {
        icon      : 'editor/delete.svg',
        token     : 'delete',
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
        token => {
            let topo_controller_misc = host.topoController.getManipulatorMisc();
            let need_update = false;
            switch (token) {
            case 'select-all':
                need_update = host.topoController.selectAllEdges();
                break;

            case 'unselect-all':
                need_update = host.topoController.unselectAllEdges();
                break;

            case 'center_split':
                need_update = topo_controller_misc.e().centerSplit();
                break;

            case 'link_up_as_face':
                need_update = topo_controller_misc.e().linkUpAsFace();
                break;

            case 'piece_together':
                need_update = topo_controller_misc.e().pieceTogether(false);
                break;

            case 'piece_together_loop': 
                need_update = topo_controller_misc.e().pieceTogether(true);
                break;

            case 'dissolve':
                need_update = topo_controller_misc.e().dissolve();
                break;

            // case 'collapse':
            //     need_update = topo_controller_misc.e().collapse();
            //     break;

            case 'hole_fill':
                need_update = topo_controller_misc.e().holeFill();
                break;

            case 'hole_fill_advanced':
                need_update = topo_controller_misc.e().holeFillAdvanced();
                break;

            case 'edges_partition':
                need_update = topo_controller_misc.e().partition();
                break;

            case 'edges_continuous-x':
                need_update = topo_controller_misc.e().continuous(0x1);
                break;

            case 'edges_continuous-y':
                need_update = topo_controller_misc.e().continuous(0x2);
                break;

            case 'edges_continuous-z':
                need_update = topo_controller_misc.e().continuous(0x4);
                break;

            case 'delete':
                need_update = topo_controller_misc.e().delete_();
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
