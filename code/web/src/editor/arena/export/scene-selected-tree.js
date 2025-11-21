
import XThree from '@xthree/basic';

/**
 * 提取
 */
export default class SceneSelectedTree extends XThree.Scene {
    /**
     * 
     * 构建
     * 
     * @param {*} coordinator 
     */
    constructor(coordinator) {
        super();
        coordinator.scene.updateMatrixWorld();
        const container = coordinator.selected_container;
        const arr = container.all();
        for (const child of arr) {
            this.children.push(child);
        }
    }
}