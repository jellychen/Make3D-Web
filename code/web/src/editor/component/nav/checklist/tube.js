/* eslint-disable no-unused-vars */

/**
 * 
 * 判断
 * 
 * @param {*} coordinator 
 */
export default function(coordinator) {
    const container = coordinator.selected_container;
    if (1 != container.count()) {
        return false;
    }

    const mesh = container.getOneValue();
    if (!mesh) {
        return false;
    }
    return true === mesh.isTubeMesh;
}
