/* eslint-disable no-unused-vars */

/**
 * 
 * 判断
 * 
 * @param {*} coordinator 
 */
export default function(coordinator) {
    return coordinator.selected_container.count() > 0;
}
