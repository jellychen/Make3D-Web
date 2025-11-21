/* eslint-disable no-unused-vars */

import SceneMenu from './v-cell-scene-menu';

/**
 * 统一控制器
 */
export default class TreeMaintainerCoordinator {
    /**
     * 成员变量
     */
    #coordinator;
    #tree;

    /**
     * 全场景的菜单
     */
    #scene_menu; 

    /**
     * 获取
     */
    get coordinator() {
        return this.#coordinator;
    }

    /**
     * 获取
     */
    get tree() {
        return this.#tree;
    }

    /**
     * 
     * 获取
     * 
     * @param {*} host 
     */
    constructor(host) {
        this.#tree = host;
    }

    /**
     * 
     * 挟制协调器
     * 
     * @param {*} coordinator 
     */
    setCoordinator(coordinator) {
        this.#coordinator = coordinator;
    }

    /**
     * 
     * 标记
     * 
     * @param {*} scene_change 
     */
    markNeedUpdateTree(scene_change = false) {
        this.#tree.markNeedUpdateTree(scene_change);
    }

    /**
     * 
     * cell 点击了
     * 
     * @param {*} cell 
     */
    onCellClick(cell) {
        if (!cell) {
            return;
        }

        // 如果当前的场景不允许选择
        const context = this.#tree.context;
        context.update();
        if (context.forbidden_selected) {
            return;
        }

        // 获取
        const object = cell.getRefObject();
        if (!object || object.isScene) {
            return;
        }

        if (this.#coordinator.keyboard_watcher.shift) {
            this.#coordinator.selected_container.select(object);
            this.#coordinator.updateTransformer();
            this.#coordinator.renderNextFrame();
            this.#tree.markNeedUpdateTree(false);
        } else {
            this.#coordinator.selected_container.replace(object);
            this.#coordinator.updateTransformer();
            this.#coordinator.renderNextFrame();
            this.#tree.markNeedUpdateTree(false);
        }
    }

    /**
     * 
     * cell 点击了
     * 
     * @param {*} cell 
     */
    onCellAnchorClick(cell) {
        if (!cell) {
            return;
        }

        const orbit = this.#coordinator.cinderella.getOrbit();
        const object = cell.getRefObject();
        if (!object || object.isScene) {
            orbit.getCameraStandController().moveTargetTo(0, 0, 0);
        } else {
            const center = object.getBasePoint(true);
            const x = center.x;
            const y = center.y;
            const z = center.z;
            orbit.getCameraStandController().moveTargetTo(x, y, z);
        }
    }

    /**
     * 
     * cell scene 显示菜单
     * 
     * @param {*} cell 
     * @param {*} x 
     * @param {*} y 
     */
    onSceneCustomizeMenu(cell, x, y) {
        if (!this.#scene_menu) {
            const scene = this.#coordinator.scene;
            this.#scene_menu = new SceneMenu(scene, this.#tree);
        }
        this.#scene_menu.show(x, y);
    }
}
