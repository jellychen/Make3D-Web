/* eslint-disable no-unused-vars */

import RtRendererDashboard from './v';

/**
 * 
 * 显示
 * 
 * @param {*} coordinator 
 * @returns 
 */
export default function(coordinator) {
    const slots     = coordinator.abattoir.upper_slots;
    const dashboard = new RtRendererDashboard(coordinator);
    const toolbar   = dashboard.toolbar;
    slots.setVisible(true);
    slots.content.appendChild(dashboard);
    const nav = coordinator.nav;
    nav.showModalContaienr(true);
    nav.getModalContainer().appendChild(toolbar);
    return dashboard;
}