/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * 用来在所有的 Cell 中共享数据
 */
export default class Context {
    /**
     * 宿主的tree
     */
    host_tree;

    /**
     * 维护者
     */
    maintainer_coordinator;

    /**
     * 禁止修改名称
     */
    forbidden_rename = false;

    /**
     * 禁止菜单
     */
    forbidden_menu = false;

    /**
     * 禁止调整属性
     */
    forbidden_ajust_sort = false;

    /**
     * 静止选择
     */
    forbidden_selected = false;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host_tree 
     * @param {*} maintainer_coordinator 
     */
    constructor(host_tree, maintainer_coordinator) {
        this.host_tree = host_tree;
        this.maintainer_coordinator = maintainer_coordinator;
    }

    /**
     * 重置
     */
    reset() {
        this.forbidden_rename     = false;
        this.forbidden_menu       = false;
        this.forbidden_ajust_sort = false;
        this.forbidden_selected   = false;
    }

    /**
     * 
     * 标记
     * 
     * @param {*} scene_change 
     */
    markNeedUpdateTree(scene_change = false) {
        this.maintainer_coordinator.markNeedUpdateTree(scene_change);
    }

    /**
     * 更新
     * 
     * 1. 只有处在scene编辑器，且没有打开光追
     * 2. 只有处在scene/bool编辑器
     * 
     */
    update() {
        const coordinator = this.maintainer_coordinator.coordinator;
        const ec          = coordinator.ec;

        //
        // 只有处在scene编辑器，且没有打开光追
        //
        if (!coordinator.isEcScene() || ec.isOpenRTWindow()) {
            this.forbidden_menu       = true;
            this.forbidden_ajust_sort = true;
        } else {
            this.forbidden_menu       = false;
            this.forbidden_ajust_sort = false;
        }

        //
        // 只有处在scene/bool编辑器
        //
        if (coordinator.isEcScene() || coordinator.isEcBoolean()) {
            this.forbidden_selected = false;
        } else {
            this.forbidden_selected = true;
        }
    }

    /**
     * 下一帧重绘
     */
    renderNextFrame() {
        if (this.host_tree) {
            this.host_tree.renderNextFrame();
        }
    }
}
