/* eslint-disable no-unused-vars */

import GlobalScope  from '@common/global-scope';
import EditableMesh from '@core/cinderella/mesh/editable';
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

    // 三角化
    {
        icon      : 'editor/triangulation.svg',
        token     : 'triangulation',
        text_token: "editor.triangulation",
    },

    // 尖分面
    {
        icon      : 'editor/split.svg',
        token     : 'center_split',
        text_token: "editor.center_split",
    },

    // // 折叠
    // {
    //     icon: 'editor/collapse.svg',
    //     token: 'collapse',
    //     text_token: "editor.collapse",
    // },

    // 面圆形化
    {
        icon      : 'editor/circularization.svg',
        token     : 'circularization',
        text_token: "editor.circularization",
    },

    // 面平整
    {
        icon      : 'editor/planarization.svg',
        token     : 'planarization',
        text_token: "editor.planarization",
    },

    // 分割线
    {
        separator : true
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

    // 分割线
    {
        separator : true
    },

    // 选择扩大
    {
        icon      : 'editor/selection_expand.svg',
        token     : 'selection_expand',
        text_token: "editor.selection_expand",
    },

    // 选择缩小
    {
        icon      : 'editor/selection_reduce.svg',
        token     : 'selection_reduce',
        text_token: "editor.selection_reduce",
    },

    // 扩散选择
    {
        icon      : 'editor/diffusion.svg',
        token     : 'selection_diffusion',
        text_token: "editor.selection_diffusion",
    },

    // 连续选择
    {
        icon      : 'editor/adjacent.svg',
        token     : 'selection_continuous',
        text_token: "editor.selection_continuous",
    },

    // 分割线
    {
        separator : true
    },

    // 提取选择的面
    {
        icon      : 'editor/selected-faces.svg',
        token     : 'extract_selection_faces',
        text_token: "editor.extract_selection_faces",
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
        (token) => {
            let topo_controller_misc = host.topoController.getManipulatorMisc();
            let need_update = false;
            switch (token) {
            case 'select-all':
                need_update = host.topoController.selectAllFaces();
                break;

            case 'unselect-all':
                need_update = host.topoController.unselectAllFaces();
                break;

            case 'triangulation':
                need_update = topo_controller_misc.f().triangulation();
                break;

            // case 'center_split':
            //     need_update = topo_controller_misc.f().centerSplit();
            //     break;
            case 'center_split':
                coordinator.sendCommandToEc({
                    cls : 'oper',
                    type: 'face.center.split',
                });
                break;

            // case 'collapse':
            //     need_update = topo_controller_misc.f().collapse();
            //     break;

            case 'planarization':
                need_update = topo_controller_misc.f().planarization();
                break;

            case 'hole_fill':
                need_update = topo_controller_misc.f().fillAllHoles(false) > 0;
                break;

            case 'hole_fill_advanced':
                need_update = topo_controller_misc.f().fillAllHoles(true) > 0;
                break;

            case 'circularization':
                need_update = topo_controller_misc.f().circularization();
                break;

            case 'selection_expand':
                need_update = topo_controller_misc.f().selectionExpand();
                if (need_update) {
                    host.updateSelectorTransformerIfEnable();
                }
                break;
            
            case 'selection_reduce':
                need_update = topo_controller_misc.f().selectionReduce();
                if (need_update) {
                    host.updateSelectorTransformerIfEnable();
                }
                break;

            case 'selection_diffusion':
                need_update = topo_controller_misc.f().selectionFromSeeds();
                if (need_update) {
                    host.updateSelectorTransformerIfEnable();
                }
                break;
            
            case 'selection_continuous':
                need_update = topo_controller_misc.f().selectionContinuous();
                if (need_update) {
                    host.updateSelectorTransformerIfEnable();
                }
                break;
            
            // 提取选择的面
            case 'extract_selection_faces': {
                    // 获取当前操作的元素
                    const current_object = host.object;
                    if (!current_object) {
                        throw new Error("current object error");
                    }

                    // 获取父亲
                    const parent = current_object.parent;
                    if (!parent) {
                        throw new Error("current object parent error");
                    }

                    // 执行面的提取
                    const soup = topo_controller_misc.f().extractSelectedFaces();

                    // 如果提取到面
                    if (soup) {
                        const Chameleon = GlobalScope.Chameleon;
                        const {
                            GeoSolidSoupTriangulator,
                        } = Chameleon;

                        // 三角化
                        const triangles_indices = GeoSolidSoupTriangulator.ConvenientPerform(soup.getPtr());
                        
                        // 构建网格
                        const mesh = new EditableMesh();
                        mesh.setName(`Extract - Faces`);
                        mesh.setGeoVertices(soup.vertices(), true);
                        mesh.setGeoIndices32(triangles_indices, true);
                        mesh.computeVertexNormalsAndReserveAcuteAngle();
                        mesh.geoChanged();
                        mesh.setEditableSoup(soup);

                        // 销毁soup
                        soup.delete();

                        // 修改
                        mesh.copyFromOther(current_object);

                        // 插入到场景中
                        if (!parent.insertAfter(this, current_object, mesh)) {
                            throw new Error("insertAfter error");
                        }

                        // 请求重绘
                        coordinator.renderNextFrame();
                        coordinator.markTreeViewNeedUpdate(true);
                    } else {
                        ;
                    }
                }
                break;

            case 'delete':
                need_update = topo_controller_misc.f().delete_();
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
