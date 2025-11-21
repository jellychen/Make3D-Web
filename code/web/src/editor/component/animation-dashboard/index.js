/* eslint-disable no-unused-vars */

import Dashboard from './v';

/**
 * 
 * 显示动画编辑节点
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function ShowAnimationDashboard(coordinator) {
    const abattoir = coordinator.abattoir;
    const view = new Dashboard(coordinator);
    abattoir.dashboard.clear();
    abattoir.dashboard.content.appendChild(view);
    abattoir.dashboard.setShow(true);
    abattoir.dashboard.setUseContentSize(true);
    return view;
}
